import {AsyncStorage} from 'react-native'; 
import URL from '../constants/URL'; 
const isLogin  = (cb) => {
    AsyncStorage.getItem('profile', (err, r) => {
        var r = JSON.parse(r);
        if( r == null ) return cb(false);
        if( r.noTelp !== undefined && r.noTelp != "" && r.noTelp != 0 )
            return cb(true);
        else return cb(false);
    });    
}

const formatCurrency = (angka) => {
    angka = angka.toString();
    angka = Number(angka);
	var rupiah = '';		
	var angkarev = angka.toString().split('').reverse().join('');
	for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+',';
	return rupiah.split('',rupiah.length-1).reverse().join('');
}

const isTimeInRange = (timeFrom,timeTo) => {
    var now = new Date();
    if( now >= timeFrom && now <= timeTo  ){
        return true;
    }else return false;
}

const convertUrl = (urlfull) => {
    var url = urlfull.split("assets");
    if( url.length > 0  )
        return URL.baseAdminUrl + "/assets" + url[1];
    else return '';
}

export default{
    isLogin,
    convertUrl,
    formatCurrency,
    isTimeInRange
}