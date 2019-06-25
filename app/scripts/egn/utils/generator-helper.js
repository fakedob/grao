module.exports = function() {
    
    this.generateRandomDate = function(start, end){      
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));        
    }

    this.generateRandomRegion = function(){
        return generateNumberInInterval(0, 999);
    }

    this.generateRandomGender = function(){
        return generateNumberInInterval(0, 1);
    }

    this.padWithZero = function(number){
        return number < 10 ? '0' + number : number;
    }

    this.padWithZeroes = function(number){
        
        if(number < 1000 && number > 99){
            return number;

        }else if(number < 100 && number > 9){
            return '0' + number;
        
        }else{
            return '00' + number;
        }
    }

    // credits to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    function generateNumberInInterval(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
