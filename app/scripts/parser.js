module.exports = {
  name: (val) => {
    const parts = val.split(' ');
    return {
      firstName: parts[0],
      middleName: parts[1],
      lastName: parts[2]
    }
  },
  addr: (val) => {
    const parts = val.split(' ');
    var addr = {};
    var index = 0;
    //get city
    if(parts[index].startsWith('ГР.')){
      addr.city = parts[index].replace('ГР.', '');
      index++;
      while(index < parts.length){
        if(addr.city == 'СТАРА ЗАГОРА'  || parts[index].startsWith('С.') || parts[index].startsWith('МЕСТНОСТ') || parts[index].startsWith('МЕСТН.') || parts[index].startsWith('Ж.К.') || parts[index].startsWith('КВ.') || parts[index].startsWith('УЛ.') || parts[index].startsWith('БУЛ.')){
          break;
        }
        else{
          addr.city += addr.city.length ? ' ' + parts[index] : parts[index];
        }
        index++;
      }
      if(index == parts.length){
        return addr;
      }
    }
    if(parts[index].startsWith('С.')){
      addr.village = parts[index].replace('С.', '');
      index++;
      while(index < parts.length){
        if(parts[index].startsWith('МЕСТНОСТ') || parts[index].startsWith('МЕСТН.') || parts[index].startsWith('Ж.К.') || parts[index].startsWith('КВ.') || parts[index].startsWith('УЛ.') || parts[index].startsWith('БУЛ.')){
          break;
        }
        else{
          addr.village += addr.village.length ? ' ' + parts[index] : parts[index];
        }
        index++;
      }
      if(index == parts.length){
        return addr;
      }
    }

    if(parts[index].startsWith('МЕСТНОСТ') || parts[index].startsWith('МЕСТН.')){
      addr.locality = parts[index].replace('МЕСТНОСТ', '').replace('МЕСТН.', '');
      index++;
      while(index < parts.length){
        if(parts[index].startsWith('КВ.') || parts[index].startsWith('Ж.К.') || parts[index].startsWith('УЛ.') || parts[index].startsWith('БУЛ.') || Number.isInteger(Number.parseInt(parts[index]))){
          break;
        }
        else{
          addr.locality += addr.locality.length ? ' ' + parts[index] : parts[index];
        }
        index++;
      }
      if(index == parts.length){
        return addr;
      }
    }
    if(parts[index].startsWith('КВ.')){
      addr.district = parts[index].replace('КВ.', '');
      index++;
      while(index < parts.length){
        if(parts[index].startsWith('Ж.К.') || parts[index].startsWith('УЛ.') || parts[index].startsWith('БУЛ.') || Number.isInteger(Number.parseInt(parts[index]))){
          break;
        }
        else{
          addr.district += addr.district.length ? ' ' + parts[index] : parts[index];
        }
        index++;
      }
      if(index == parts.length){
        return addr;
      }
    }
    if(parts[index].startsWith('Ж.К.')){
      addr.residential = parts[index].replace('Ж.К.', '');
      index++;
      while(index < parts.length){
        if(parts[index].startsWith('УЛ.') || parts[index].startsWith('БУЛ.') || Number.isInteger(Number.parseInt(parts[index]))){
          break;
        }
        else{
          addr.residential += addr.residential.length ? ' ' + parts[index] : parts[index];
        }
        index++;
      }
      if(index == parts.length){
        return addr;
      }
    }
    if(parts[index].startsWith('УЛ.') || parts[index].startsWith('БУЛ.')){
      addr.ave = parts[index].startsWith('БУЛ.');
      addr.street = parts[index].replace('БУЛ.', '').replace('УЛ.', '');
      index++;
      while(index < parts.length){
        if(Number.isInteger(Number.parseInt(parts[index]))){
          break;
        }
        else{
          addr.street += addr.street.length ? ' ' + parts[index] : parts[index];
        }
        index++;
      }
      if(index == parts.length){
        return addr;
      }
    }
    if(Number.isInteger(Number.parseInt(parts[index]))){
      addr.num = Number.parseInt(parts[index]);
      index++;
      if(index == parts.length){
        return addr;
      }
    }
    if(!Number.isInteger(Number.parseInt(parts[index])) && parts[index].length == 1){
      addr.entry = parts[index];
      let entry = parts[index].replace('00' + addr.num, '').replace(addr.num, '').replace('0' + addr.num, '');
      if(entry.length == 1 && entry != '0')
        addr.entry = entry;

      index++;
      if(index == parts.length){
        return addr;
      }
    }
    if(Number.isInteger(Number.parseInt(parts[index])) && parts[index].length == 2){
      addr.floor = Number.parseInt(parts[index]);
      index++;
      if(index == parts.length){
        return addr;
      }
    }
    if(Number.isInteger(Number.parseInt(parts[index])) && parts[index].length == 3){
      addr.flat = Number.parseInt(parts[index]);
      index++;
      if(index == parts.length){
        return addr;
      }
    }

    if(index < parts.length){
      //адреса не е обозначен...
      if(!Number.isInteger(Number.parseInt(parts[index]))){
        addr.ave = false;
        addr.street = parts[index];
        index++;
        while(index < parts.length){
          if(Number.isInteger(Number.parseInt(parts[index]))){
            break;
          }
          else{
            addr.street += addr.street.length ? ' ' + parts[index] : parts[index];
          }
          index++;
        }
        if(index == parts.length){
          return addr;
        }
      }

      if(Number.isInteger(Number.parseInt(parts[index]))){
        addr.num = Number.parseInt(parts[index]);

        let entry = parts[index].replace('00' + addr.num, '').replace(addr.num, '').replace('0' + addr.num, '');
        if(entry.length == 1 && entry != '0'){
          addr.entry = entry;
          index++;
        }

        index++;
        if(index >= parts.length){
          return addr;
        }
      }
      if(!Number.isInteger(Number.parseInt(parts[index])) && parts[index].length == 1){
        addr.entry = parts[index];
        index++;
        if(index == parts.length){
          return addr;
        }
      }
      if(Number.isInteger(Number.parseInt(parts[index])) && parts[index].length == 2){
        addr.floor = Number.parseInt(parts[index]);
        index++;
        if(index == parts.length){
          return addr;
        }
      }
      if(Number.isInteger(Number.parseInt(parts[index])) && parts[index].length == 3){
        addr.flat = Number.parseInt(parts[index]);
        index++;
        if(index == parts.length){
          return addr;
        }
      }
    }
    return addr;
  }
}