module.exports = function() {

    /**
     * Check Bulgarian EGN codes for validity
     *
     * @param  {String} egn
     * @return {Boolean}
     */
    this.validate = function(egn) {

        var date = initDate(egn);
        var checkSum = computeCheckSum(egn);

        if(isValidLength(egn) &&
           containsIntegerOnly(egn) &&
           isValidDate(date.year, date.month, date.day) &&
           isValidCheckSum(checkSum, egn)){
               return true;
        }else{
            return false;
        }
    };

    /**
     * Check multiple Bulgarian EGN codes for validity
     *
     * @param  {String} egn
     * @return {Boolean}
     */
    this.validateList = function(list){

        list.forEach(function(egn) {
            if(!egn){
                return false;
            }
        });

        return true;
    }
    
    function isValidLength(egn){
        return egn.length === 10;
    }

    function containsIntegerOnly(egn){
        return /[0-9]/.test(egn);
    }

    function initDate(egn){
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
        date.month = month;
        date.day = day;

        return date;
    }

    function isValidDate(y, m, d) {
        var date = new Date(y, m - 1, d);
        return date && 
               (date.getMonth() + 1) == m && date.getDate() == Number(d) &&
               checkGregorianCalendarFirstAdoption(y, m, d);
    }

    // Gregorian calendar adoption in 1916 in Bulgaria
    // 31/03/1916 > +13 days > 14/04/1916
    function checkGregorianCalendarFirstAdoption(year, month, day){
        if (year === 1916 &&
            month === 4 &&
            day <= 13){
                return false;
        }else{
            return true;
        } 
    }

    function computeCheckSum(egn){
        var checkSum = 0;
        var weights = [2,4,8,5,10,9,7,3,6];

        for (var i = 0; i < weights.length; ++i) {
            checkSum += weights[i] * Number(egn.charAt(i));
        }

        checkSum %= 11;
        checkSum %= 10;

        return checkSum;
    }

    function isValidCheckSum(checkSum, egn){
        return checkSum === Number(egn.charAt(9));
    }
}
