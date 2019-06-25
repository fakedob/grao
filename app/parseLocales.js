const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Create a new MongoClient
const client = new MongoClient(process.env.mongoUrl);
let db;

let working = true;

client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db = client.db(process.env.dbName);
  _process(()=>{
    console.log('--- END ---');
    working = false;
  });
});

const htmlToJson = require('html-to-json'),
      fs = require('fs');

var _currentSelection = null;

var _process = (_cb) => {
  var _currentSelectionIndex = 0;
  var _areas = [];
  var _cities = [];
  var _sections = [];
  db.collection('area')
  .find({})
  .limit(10000)
  .toArray(function (error, response) {
    _areas = response;
    db.collection('city')
    .find({})
    .limit(10000)
    .toArray(function (error, response) {
      _cities = response;
      db.collection('section')
      .find({})
      .limit(10000)
      .toArray(function (error, response) {
        _sections = response;
        _doNext(_cb);
      });
    });
  });
  
  var _doNext = (_cb) => {
    if(_currentSelectionIndex >= _sections.length){
      if(_cb)
        _cb();
    }
    else{
      _currentSelection = _sections[_currentSelectionIndex];
      var _currentCity = _cities.find(x => x._id.toString() == _currentSelection.city.toString());
      var _currentArea = _areas.find(x => x._id.toString() == _currentCity.area.toString());

      var _areaUUID = _currentArea.uuid < 10 ? '0' + _currentArea.uuid : _currentArea.uuid + '';
      var _sectionUUID = _currentSelection.uuid + '';
      while(_sectionUUID.length < 5){
        _sectionUUID = '0' + _sectionUUID;
      }
      var uuid = `27${_areaUUID}${_sectionUUID}`;

      var _data = fs.readFileSync(__dirname + `/rik/${uuid}.html`, 'utf8');

      var _parsed = _parseData(_data);
      var _document = Object.assign({}, _currentSelection, {
        ..._parsed
      })
      
      // db.collection('section').save(_document, function (error, response) {
        _currentSelectionIndex++;
        _doNext(_cb);
      // });
    }
  }
}

var _parseData = (_d, _cb, _err) => {
  if(!_d){
    if(_cb)
      _cb(false);

    return;
  }

  htmlToJson.parse(_d, {
    'text': function ($doc) {
      var array = $doc[0].firstChild.children;
      var _currentArea = null,
          _currentIndex = 1,
          _currentCity = null,
          _currentCityIndex = 1;

      var _areas = [],
          _cities = [],
          _sections = [];

      for(var a in array){
        var elem = array[a];
        if(elem.type == 'tag'){
          if(elem.name == 'h4'){
            _currentArea = {
              name: elem.firstChild.data.replace('община ', ''),
              uuid: _currentIndex
            }
            _areas.push(_currentArea);
            _currentIndex++;
          }
          else if (elem.name == 'div'){
            _currentCity = {
              uuid: _currentCityIndex,
              areaId: _currentArea.uuid,
              name: elem.attribs['data-city'].replace('гр. ', '').replace('с. ', ''),
              isCity: elem.attribs['data-city'].startsWith('гр. ')
            }
            _cities.push(_currentCity);
            _currentCityIndex++;

            for(var b in elem.childNodes){
              var _section = elem.childNodes[b];
              if(_section.name == 'span'){
                var section = {
                  cityId: _currentCity.uuid,
                  uuid:  _section.firstChild.data
                }
                _sections.push(section);
              }
            }
          }
        }
      }
      return {
        areas: _areas,
        cities: _cities,
        sections: _sections
      };
    }
  }, function (err, result) {
      if(err && _err)
        _err(err, result);
      else if(!err && _cb)
        _cb(result);
  });
}

var _z = () => {
  if(working)
    setTimeout(_z, 1);
  else
    process.exit(0);
}
_z();