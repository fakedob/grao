module.exports = function() {

    this.searchRegionId = function(regionId, locale){

        if(regionId > 999 || regionId < 0){

            return -1;
        }

        if(locale !== 'en' && locale !== 'bg'){

            return -1;
        }

        for(var region in EGN_REGIONS){
            if(regionId <= region){
                return EGN_REGIONS[region][locale];
            }
        }
    }
}

const EGN_REGIONS = 
{
    43: {'bg': 'Благоевград', 'en': 'Blagoevgrad'},  // 000 - 043
    93: {'bg': 'Бургас', 'en': 'Burgas'},  // 044 - 093
    139: {'bg': 'Варна', 'en': 'Varna'},  // 094 - 139
    169: {'bg': 'Велико Търново', 'en': 'Veliko Turnovo'},  // 140 - 169
    183: {'bg': 'Видин', 'en': 'Vidin'},  // 170 - 183
    217: {'bg': 'Враца', 'en': 'Vratza'},  // 184 - 217
    233: {'bg': 'Габрово', 'en': 'Gabrovo'},  // 218 - 233
    281: {'bg': 'Кърджали', 'en': 'Kurdzhali'},  // 234 - 281
    301: {'bg': 'Кюстендил', 'en': 'Kyustendil'},  // 282 - 301
    319: {'bg': 'Ловеч', 'en': 'Lovech'},  // 302 - 319
    341: {'bg': 'Монтана', 'en': 'Montana'},  // 320 - 341
    377: {'bg': 'Пазарджик', 'en': 'Pazardzhik'},  // 342 - 377
    395: {'bg': 'Перник', 'en': 'Pernik'},  // 378 - 395
    435: {'bg': 'Плевен', 'en': 'Pleven'},  // 396 - 435
    501: {'bg': 'Пловдив', 'en': 'Plovdiv'},  // 436 - 501
    527: {'bg': 'Разград', 'en': 'Razgrad'},  // 502 - 527
    555: {'bg': 'Русе', 'en': 'Ruse'},  // 528 - 555
    575: {'bg': 'Силистра', 'en': 'Silistra'},  // 556 - 575
    601: {'bg': 'Сливен', 'en': 'Sliven'},  // 576 - 601
    623: {'bg': 'Смолян', 'en': 'Smolyan'},  // 602 - 623
    721: {'bg': 'София', 'en': 'Sofia'},  // 624 - 721
    751: {'bg': 'София (окръг)', 'en': 'Sofia (county)'},  // 722 - 751
    789: {'bg': 'Стара Загора', 'en': 'Stara Zagora'}, // 752 - 789
    821: {'bg': 'Добрич', 'en': 'Dobrich'},  // 790 - 821
    843: {'bg': 'Търговище', 'en': 'Targovishte'},  // 822 - 843
    871: {'bg': 'Хасково', 'en': 'Haskovo'},  // 844 - 871
    903: {'bg': 'Шумен', 'en': 'Shumen'},  // 872 - 903
    925: {'bg': 'Ямбол', 'en': 'Yambol'},  // 904 - 925
    999: {'bg': 'Друг', 'en': 'Other'}  // 926 - 999
}