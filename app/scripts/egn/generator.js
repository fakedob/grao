var util = require('./utils/generator-helper.js')();

module.exports = function(year, month, day, gender, region) {
 
  var args = init(day, month, year, gender, region);
  var egn = computeValidEGN(args.year, args.month, args.day, args.regionId);

  return {
    egn,
    gender: args.gender
  };
};

function init(day, month, year, gender, regionId){
    var args = {};

    if(day && month && year){
        let _month = month + 1 < 10 ? '0' + month : + month,
            _day = day + 1 < 10 ? '0' + day : + day;

        args.date = new Date(`${year}-${_month}-${_day}`);
    }else{
        args.date = generateRandomDate(new Date('1966-01-01'), new Date('2098-11-30'));
    }

    args.year = year || args.date.getFullYear();
    args.month = month || args.date.getMonth();
    args.day = day || args.date.getDate();

    if (args.date < new Date('1900-01-01')){
        args.month += 20;

    }else if(args.date > new Date('1999-11-31')){
        args.month += 40;
    }

    // zero based
    args.year = args.year % 100;

    args.regionId = Number.isInteger(regionId) ? regionId : generateRandomRegion();
    args.gender = Number.isInteger(gender) ? gender : generateRandomGender();

    args.regionId = initRegion(args.regionId, args.gender);

    return args;
}

function initRegion(regionId, gender){

  if (gender == 0 && (regionId % 2 != 0))
    regionId--;
  /* Make it even */
  if (gender == 1 && (regionId % 2 == 0))
    regionId++;

    return regionId;
}

function computeValidEGN(year, month, day, regionId){

    var weights = [2, 4, 8, 5, 10, 9, 7, 3, 6];
    year = padWithZero(year);
    month = padWithZero(month);
    day = padWithZero(day);
    regionId = padWithZeroes(regionId);

    var egn = year  + '' +
              month + '' +
              day   + '' +
              regionId;
    
    var checkSum = 0;
    for(var i = 0; i < weights.length; ++i){
        checkSum +=  weights[i] * Number(egn.charAt(i)); 
    }

    checkSum = checkSum % 11;
    checkSum = checkSum < 10 ? checkSum : 0;

    return egn + '' + checkSum;
}