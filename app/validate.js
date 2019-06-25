var Processor = require('./scripts/processor');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Create a new MongoClient
const client = new MongoClient(process.env.mongoUrl);
let db;

client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db = client.db(process.env.dbName);
  _z();
});

let _documents = [];
let _batch = (_batchDocuments) => {
  new Processor(db, Object.assign([], _batchDocuments), () => {
    _documents = _documents.filter( x => !_batchDocuments.includes(x) );
    console.log()
  });
}
var _z = ()=> {
  if(_documents.length < 20000){
    db.collection(process.env.collection)
    .find({
      check: false,
      _id: {
        $nin: _documents.map(x=> x._id)
      }
    })
    .sort({
      year: -1
    })
    .limit(10000)
    .toArray(function (error, response) {
      _documents = _documents.concat(response);
      _z();
      for(var a =0; a< response.length; a+=100){
        _batch(response.slice(a, a + 100));
      }
    });
  }
  else{
    setTimeout(() => {
      _z();
    }, 10);
  }
}