
import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import countBy from 'lodash/countBy';
import keyBy from 'lodash/keyBy';
import fromPairs from 'lodash/fromPairs';
import toPairs from 'lodash/toPairs';
import startCase from 'lodash/startCase';





import { USERINFO, LOGINGS } from '../reducers/constants';
import { PhoneNumberUtil } from 'google-libphonenumber';

const arr2kv = (keys, vals) => {
    var d = {};
    keys.map((k, i) => { d[k] = vals[i] });
    return d;
}




function monthname(m) {
    var x = '' + parseInt(m);
    const month_names = {
        '1': "January", '2': 'Febraury', '3': 'March', '4': 'April', '5': 'May', '6': 'June',
        '7': 'July', '8': 'August', '9': 'September', '10': 'October', '11': 'November', '12': 'December'
    }
    return get(month_names, x, 'Unknown');
}



function randomString(len=6) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}





export const dateobj_offset = (dt, offset) => {
    if (Number.isInteger(offset)) {       
        dt.setDate(dt.getDate() + parseInt(offset));
        return dt;
    } else {
        return dt;
    }
};




function validateRE(re1, txt) {
    var re = RegExp(re1);
    return re.test(String(txt));
}

const abhyasiid_regex = "^([a-zA-Z]{6}[0-9]{3}|[HABhab]{1}[0-9]{8})$";
const pnr_regex = '^[0-9A-Z]{2}-[A-Z]{4}-[A-Z]{4}$';


function validatePhoneNumber(phoneNumber) {

    if (validateRE(/\d{10}/, phoneNumber)) {
        // valid 10 digit format
        return true
    }

    /*
    Phone number validation using google-libphonenumber
    */
    let valid = false;
    try {
        const phoneUtil = PhoneNumberUtil.getInstance();
        valid = phoneUtil.isValidNumber(phoneUtil.parse(phoneNumber));
    } catch (e) {
        valid = false;
    }
    return valid;
}

function date_to_momentformat(date) {
    const pad = (x) => (x <= 9 ? '0' + x : x);
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    var s = date.getSeconds();
    var mm = date.getMinutes();
    var h = date.getHours();
    return '' + y + pad(m) + pad(d) + pad(h) + pad(mm) + pad(s);
}

const isnotnull =  (x) => (!isNil(x) && x !== "");

export default {
    jsonparse: (obj, def) => {
        try {
            return JSON.parse(obj);
        } catch (error) {
            return def;
        }
    },

    calcAge : (d) => {
        var birthday = +new Date(parseInt(d.substr(0, 4)), parseInt(d.substr(4, 2)) - 1, parseInt(d.substr(6, 2)));
        return ~~((Date.now() - birthday) / (31557600000));
    },


    arr2kv, dateobj_offset, monthname, 

    today: () => (new Date()), 

    userName: (ls) => get(ls, [USERINFO, "myInfo", "name"], ""),
    loggedIn: (ls) => isnotnull(get(ls, [USERINFO, "uid"], null)),
    userEmail: (ls) => get(ls, [USERINFO, "myInfo", "user_email"], false),
    userPhone: (ls) => get(ls, [USERINFO, "myInfo", "mobile"], ""),
    abhyasiID: (ls) => get(ls, [USERINFO, "myInfo", "ref"], false), 
    isOpenLoginForm: (gs) => get(gs, [LOGINGS, "openLoginForm"], false), 

    userAddress: (ls) => [get(ls, [USERINFO, "myInfo", "street"], ""),
        get(ls, [USERINFO, "myInfo", "street2"], "") ,
        get(ls, [USERINFO, "myInfo", "street3"], "") , 
        get(ls, [USERINFO, "myInfo", "street4"], "") , 
        get(ls, [USERINFO, "myInfo", "city"], "") , 
        get(ls, [USERINFO, "myInfo", "postal_code"], "")].join(" ").trim(),

    positions: (ls) => get(ls, [USERINFO, "positions"], []),

    getGS: (gs, ns, d) => get(gs, ns, d),

    getPS: (ls, ns, d = {}) => get(ls, ns, d),


    beforeunload: (fn) => window.addEventListener('beforeunload', fn),

    log: process.env.NODE_ENV === 'production' ? () => { } : console.log,
    isnotnull,
    isnull: (x) => (isNil(x) || x === ""),
    get, set, has, isEqual, isNil, countBy, keyBy, fromPairs, toPairs, startCase,

    titleCase: (n) => { try { return startCase(n.toLowerCase()) } catch (e) {return n} } ,
    lowerCase: (n) => { try { return n.toLowerCase() } catch (e) { return n } } ,
    upperCase: (n) => { try { return n.toUpperCase() } catch (e) { return n } } ,

    validateRE, randomString, date_to_momentformat,

    validateAbhyasiID: (t) => validateRE(abhyasiid_regex,  t),
    validatePNR: (t) => validateRE(pnr_regex, t),
    validatePhoneNumber,

    
    

    transform_value: (type, val) => {
        switch (type) {
            case 'date':
                return short_date(val);
            case 'yesno':
                return val ? "yes" : "no";
            case 'gender':
                return get({ F: "Female", M: "Male" }, val, "Not Mentioned");
            case 'variant':
                return get({ A: "A/c", N: "Non A/c" }, val, "Not Available");
            case 'age_group':
                const age_group = {
                    "0": "00-04 Children", "5": "05-09 Children", "10": "10-14 Children",
                    "15": "15-19 Youth", "20": "20-24 Youth", "25": "25-29 Youth",
                    "30": "30-34 Youth", "35": "35-39 Adults", "40": "40-44 Adults",
                    "45": "45-49 Adults", "50": "50-55 Adults", "55": "55-59 Adults",
                    "60": "60-64 Seniors", "65": "65-69 Seniors", "70": "70-74 Seniors",
                    "75": "75-79 Seniors", "80": "80-85 Seniors", "85": "85+ Seniors", "90": "90+ Seniors",
                };
                return get(age_group, val.toString(), "Not Specified");
            case "idcard_type":
                const poi_type = {
                    srcmid: "SRCM / Heartfulness ID", aadhar: "Aadhar", passport: "Passport",
                    drvlic: "Other ID Cards", child: "Children", heartfulnessid: "Heartfulness ID",
                    otherid: "Other ID Cards",
                };
                return get(poi_type, val, val);
            default:
                return val;
        }
    }
}