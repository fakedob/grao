module.exports = function() {
    this.getMonth = function(index, locale){

        if(index > 12 || index < 1){
            return -1;
        }

        if(locale !== 'en' && locale !== 'bg'){
            return -1;
        }

        return MONTHS[index-1][locale];
    };
}

const MONTHS = 
[ 
    {'bg': 'Януари', 'en': 'January'},
    {'bg': 'Февруари', 'en': 'February'},
    {'bg': 'Март', 'en': 'March'},
    {'bg': 'Април', 'en': 'April'},
    {'bg': 'Май', 'en': 'May'},
    {'bg': 'Юни', 'en': 'June'},
    {'bg': 'Юли', 'en': 'Jule'},
    {'bg': 'Август', 'en': 'August'},
    {'bg': 'Септември', 'en': 'September'},
    {'bg': 'Октомври', 'en': 'October'},
    {'bg': 'Ноември', 'en': 'November'},
    {'bg': 'Декември', 'en': 'December'},
];

