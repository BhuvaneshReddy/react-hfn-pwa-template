
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

import { USERINFO, FETCHGS } from '../reducers/constants';

const arr2kv = (keys, vals) => {
    var d = {};
    keys.map((k, i) => { d[k] = vals[i] });
    return d;
}

const findAndReplace = (list, pk_key, pk_val, new_obj) => list.map(a => (a[pk_key] === pk_val) ? { ...a, ...new_obj } : a);

function randomString(len=6) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
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



    today: () => (new Date()), 

    userName: (ls) => get(ls, [USERINFO, "myInfo", "name"], ""),
    loggedIn: (ls) => isnotnull(get(ls, [USERINFO, "uid"], null)),
    userEmail: (ls) => get(ls, [USERINFO, "myInfo", "user_email"], false),
    userPhone: (ls) => get(ls, [USERINFO, "myInfo", "mobile"], ""),
    abhyasiID: (ls) => get(ls, [USERINFO, "myInfo", "ref"], false), 

    userAddress: (ls) => [get(ls, [USERINFO, "myInfo", "street"], ""),
        get(ls, [USERINFO, "myInfo", "street2"], "") ,
        get(ls, [USERINFO, "myInfo", "street3"], "") , 
        get(ls, [USERINFO, "myInfo", "street4"], "") , 
        get(ls, [USERINFO, "myInfo", "city"], "") , 
        get(ls, [USERINFO, "myInfo", "postal_code"], "")].join(" ").trim(),


    getGS: (gs, ns, d) => get(gs, ns, d),
    getFetchResult: (gs, key) => get(gs, [FETCHGS, key], null),

    getPS: (ls, ns, d = {}) => get(ls, ns, d),

    beforeunload: (fn) => window.addEventListener('beforeunload', fn),

    log: process.env.NODE_ENV === 'production' ? () => { } : console.log,
    isnotnull,
    isnull: (x) => (isNil(x) || x === ""),
    get, set, has, isEqual, isNil, countBy, keyBy, fromPairs, toPairs, startCase,

    titleCase: (n) => { try { return startCase(n.toLowerCase()) } catch (e) {return n} } ,
    lowerCase: (n) => { try { return n.toLowerCase() } catch (e) { return n } } ,
    upperCase: (n) => { try { return n.toUpperCase() } catch (e) { return n } } ,
    arr2kv, 
    randomString, 
    findAndReplace,
}