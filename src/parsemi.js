import Parse from 'parse/dist/parse.min.js';

import config from '../config/front.js';

const SDK_URL = config.sdkURL || "http://localhost:3000";
const PARSE_URL = config.serverURL || "http://localhost:1337/parse";
const APP_ID = config.appId || "IQGR3JRHIFLST86A";
const JS_KEY = config.javascriptKey || "S78D3J7JGYOXSEU6";
const PARSE_SECRET = config.userSecret || "984EBTBS9PELZRTY";

console.log("Server running on " + PARSE_URL);
console.log("SDK running on " + SDK_URL);

const LIMIT = 5;

Parse.initialize(APP_ID, JS_KEY);
Parse.serverURL = PARSE_URL;
Parse.enableEncryptedUser();
Parse.secret = PARSE_SECRET;

export default Parse;

export const Datemi = {
    local(date, offset){
        if(!offset)
          offset = 7;
        if(!date)
          date = new Date();
        var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
        return new Date(utc + (3600000*offset));
    },
    today: () => {
        return new Date();
    },
    todayFirst: () => {
        const td = Datemi.today();
        return new Date(td.getFullYear(), td.getMonth(), td.getDate(), 0, 0, 0);
    },
    todayLast: () => {
        const td = Datemi.today();
        return new Date(td.getFullYear(), td.getMonth(), td.getDate(), 23, 59, 0);
    },
    hDate(date, noTime=false){
      date = this.local(date);
      let day = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      let month = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      let year = date.getFullYear();
      let h = String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0');
      if(noTime)
        return day[date.getDay()] + ", " + date.getDate() + " " + month[date.getMonth()] + " " + year;
      else 
        return day[date.getDay()] + ", " + date.getDate() + " " + month[date.getMonth()] + " " + year + " " +h;
    }
}

export const User = {
    current: () => {
        return Parse.User.current();
    },
    login: (username, password) => {
        return Parse.User.logIn(username, password);
    },
    logout: () => {
        return Parse.User.logOut();
    },
    instance: () => {
        const current = Parse.User.current();
        return current.get('instance');
    }
};