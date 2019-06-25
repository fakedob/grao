const regionHelper = require('./utils/regions-helper.js')();
const monthHelper = require('./utils/months-helper.js')();
const validator = require('./validator.js')();

module.exports = function() {
    
    /**
     * Parse the EGN and return additional information like born date , region and gender
     *
     * @param {String} egn, Valid egn
     
     * @return {Object}, Parsed information from the EGN given
     */
    this.parse = function(egn, locale) {
        locale = locale || 'en';

        if(!validate(egn)){
            return {error: 'This EGN is not valid'};
        }

        const date = parseDate(egn, locale);
        const region = parseRegion(egn, locale);
        const gender = parseGender(egn, locale);

        var parsedEgn = {};
        parsedEgn.date = date;
        parsedEgn.region = region;
        parsedEgn.gender = gender;

        return parsedEgn;
    };
}

function parseDate(egn, locale){
    var date = {};

    var year = Number(egn.slice(0, 2));
    var month = Number(egn.slice(2, 4));
    var day = Number(egn.slice(4, 6));

    if (month >= 40) {
        year += 2000;
        month -= 40;

    } else if (month >= 20) {
        year += 1800;
        month -= 20;
        
    } else {
        year += 1900;
    }

    date.year = year;
    date.month = getMonth(month, locale);
    date.monthIndex = month;
    date.day = day;

    return date;
}

function parseRegion(egn, locale){
    var regionId = Number(egn.slice(6, 9));
    var region = searchRegionId(regionId, locale);
    
    return region; 
}

function parseGender(egn, locale){
    var gender = Number(egn.slice(9, 10));
    var genderText = {
        male: {'en': 'Male', 'bg': 'Мъж'},
        female: {'en': 'Female', 'bg': 'Жена'}
    };

    if(gender % 2 === 0){
        return genderText['male'][locale];
    
    }else{
        return genderText['female'][locale];
    }
}