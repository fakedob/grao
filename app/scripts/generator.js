var generate = require('./egn/generator');

var _g = (_date) => {
  var uuidsForDate = [];

  var year = _date.getFullYear();
  var month = _date.getMonth() + 1;
  var day = _date.getDate();

  for(var a = 0; a < 789 - 752; a += 2){
    uuidsForDate.push(generate(year,month,day, 0, 752 + a));
  }
  for(var a = 1; a < 789 - 752 + 1; a += 2){
    uuidsForDate.push(generate(year,month,day, 1, 752 + a));
  }

  return uuidsForDate;
}

module.exports = _g;
