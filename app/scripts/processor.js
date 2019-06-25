class Processor {
  constructor(_db, _chunkDocuments, _cb)
    {
      const { Curl } = require('node-libcurl'),
            htmlToJson = require('html-to-json'),
            random_useragent = require('random-useragent'),
            parser = require('./parser');


      var curl;

      const _url = 'https://priem.starazagora.bg:5443';
      
      let _onEnd = null;

      let _token = '',
          _init = false,
          _document = '',
          _documents = _chunkDocuments;

      let db = null;

      var _getNext = () => {
        return _documents.shift();
      }

      var _getToken = (_t) => {
        let _patern = '_token" id="token" value="';
        let _index = _t.indexOf(_patern) + _patern.length;
        let result = _t.slice(_index);
        return result.slice(0, result.indexOf('"'));
      }

      var _parseData = (_d, _cb, _err) => {
        if(!_d){
          if(_cb)
            _cb(false);

          return;
        }

        htmlToJson.parse(_d, {
          'text': function ($doc) {
            return $doc.find('b').toArray().map(x => x.firstChild ? x.firstChild.data : '')
          }
        }, function (err, result) {
            if(err && _err)
              _err(err, result);
            else if(!err && _cb)
              _cb(result);
        });
      }

      var _doNext = () => {
        if(_documents.length == 0){
          _onEnd();
        }
        else{
          curl.perform();
        }
      }

      var _setup = () => {
        curl = new (require('node-libcurl').Curl)();

        curl.setOpt(Curl.option.URL, _url);
        curl.setOpt(Curl.option.HEADER, ':authority: priem.starazagora.bg:5443');
        curl.setOpt(Curl.option.HEADER, ':method: GET');
        curl.setOpt(Curl.option.HEADER, ':scheme: https');
        curl.setOpt(Curl.option.HEADER, 'accept: application/json, text/javascript, */*; q=0.01');
        curl.setOpt(Curl.option.HEADER, 'accept-encoding: gzip, deflate, br');
        curl.setOpt(Curl.option.HEADER, 'accept-language: en-US,en;q=0.9,bg;q=0.8');
        curl.setOpt(Curl.option.HEADER, 'cache-control: no-cache');
        curl.setOpt(Curl.option.HEADER, `origin: ${_url}`);
        curl.setOpt(Curl.option.HEADER, 'pragma: no-cache');
        curl.setOpt(Curl.option.HEADER, `referer: ${_url}/`);
        curl.setOpt(Curl.option.HEADER, 'user-agent: ' + random_useragent.getRandom());
        curl.setOpt(Curl.option.HEADER, 'x-requested-with: XMLHttpRequest');

        curl.on('end', function (statusCode, data, headers) {
          try{
            let cookie = headers[0]['Set-Cookie'].map(c=>c.substr(0, c.indexOf(";"))).reduce((a, b) => a + "; " + b);
            curl.setOpt(Curl.option.COOKIE, cookie);
          }
          catch(err){
            console.log('cookie parse fail for: ', _document)

            db.collection(process.env.error_collection).insertOne({
              egn: _document.egn,
              method: 'parse cookie'
            }, function (error, response) {
              _document.check = true;
              db.collection(process.env.collection).save(_document, function (error, response) {
                _onEnd();
              });
            });
            return;
          }
          
          
          let _data = undefined;
          try{
            if(_init)
              _data = JSON.parse(data).child;
          }
          catch(err){
            db.collection(process.env.error_collection).insertOne({
              egn: _document.egn,
              method: 'parse json'
            }, function (error, response) {
              _document.check = true;
              db.collection(process.env.collection).save(_document, function (error, response) {
                _onEnd();
              });
            });
            return;
          }
          
          _parseData(_data, (vals) => {
            if(!_init){
              _token = _token || _getToken(data);
          
              curl.setOpt(Curl.option.URL, `${_url}/check-child`);
          
              curl.setOpt(Curl.option.HEADER, ':method: POST');
              curl.setOpt(Curl.option.HEADER, ':path: /check-child');
              curl.setOpt(Curl.option.HEADER, 'content-type: application/x-www-form-urlencoded; charset=UTF-8');
          
              _init = true;
            }
            else if(vals){
              _document = Object.assign(_document, {
                ...parser.name(vals.text.shift()),
                ...parser.addr(vals.text.shift()),
                diff: false
              })
              if(vals.text.length){
                _document.diff = true;
              }
              _document.valid = true;
              _document.check = true;

              db.collection(process.env.collection).save(_document, function (error, response) {
                _doNext();
              });
            }
            else {
              _document.check = true;
              db.collection(process.env.collection).save(_document, function (error, response) {
              });
            }
            
            _document = _getNext();

            curl.setOpt(Curl.option.HEADER, 'user-agent: ' + random_useragent.getRandom());
            curl.setOpt(Curl.option.HTTPPOST, [
              { name: '_token', contents: _token },
              { name: 'child_egn', contents: _document.egn },
              { name: 'parent_egn', contents: '' },
              { name: 'lk_number', contents: '' }
            ]);
            
            if(!vals || !vals.text.length)
              _doNext();
          }, (err, result) => {
            db.collection(process.env.error_collection).insertOne({
              egn: _document.egn,
              method: 'parse data error'
            }, function (error, response) {
              _document.check = true;
              db.collection(process.env.collection).save(_document, function (error, response) {
                _onEnd();
              });
            });
          })
        });

        curl.on('error', (err) => {
          db.collection(process.env.error_collection).insertOne({
            egn: _document.egn,
            method: 'curl error'
          }, function (error, response) {
            _onEnd();
          });
        });
      }
      
      db = _db;
      
      _onEnd = _cb;
      
      _setup();
      _doNext();
    }
}

module.exports = Processor;