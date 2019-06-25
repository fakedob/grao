_g = require('./scripts/generator');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Create a new MongoClient
const client = new MongoClient(process.env.mongoUrl);

let _today = new Date();//new Date('1950-01-01');

let _egn = '',
    _uuids = _g(_today),
    _currentDate = _today,
    _endDate = new Date('1890-01-01')

var _getNext = () => {
  if(_uuids.length == 0){
    _currentDate.setDate(_currentDate.getDate() - 1);
    _uuids = _g(_currentDate);
  }
  return _uuids.shift();
}
var results = [];
while(_currentDate >= _endDate){
  _egn = _getNext();
  var data = {
    egn: _egn.egn,
    gender: _egn.gender,
    year: _currentDate.getFullYear(),
    month: _currentDate.getMonth() + 1,
    day: _currentDate.getDate(),
    check: false,
    valid: false
  }
  results.push(data);
}
// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(process.env.dbName);

  db.collection(process.env.collection).insertMany(results, function (error, response) {
    console.log(results.length)
  });
});