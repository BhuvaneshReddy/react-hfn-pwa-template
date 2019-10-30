
import queryString from 'query-string'
import { Base64 } from 'js-base64'

const env = {
    registrations_server: process.env.REACT_APP_REG_SERVER,
}

const u = {
    jsonparse: (obj, def) => {
        try {
            return JSON.parse(obj);
        } catch (error) {
            return def;
        }
    },
    isnotnull: (x) => (x !== undefined && x !== null && x !== ""),
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 56; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
}
function getToken() {
    var tok = makeid();
    tok = setCharAt(tok, 10, 'cmrs'.charAt(Math.floor(Math.random() * 4)));
    tok = setCharAt(tok, 24, 'cmrs'.charAt(Math.floor(Math.random() * 4)));
    tok = setCharAt(tok, 34, 'cmrs'.charAt(Math.floor(Math.random() * 4)));
    tok = setCharAt(tok, 42, 'cmrs'.charAt(Math.floor(Math.random() * 4)));
    return tok;
}

// algorithm version
const evers = "e2"

const chr = (n) => String.fromCharCode(n);
const ord = (c) => c.charCodeAt(0);
function encode1(key, string) {
    return Base64.encode(string);
}

function decode1(key, enc_string) {
    return Base64.decode(enc_string);
}

function encode0(key, string) {
    var encoded_chars = "";
    var i;
    for (i = 0; i < string.length; i++) {
        const key_c = key[(i) % key.length];
        const encoded_c = chr((ord(string[i]) + ord(key_c)) % 256);
        encoded_chars = encoded_chars + encoded_c;
    }
    var r = Base64.btoa(encoded_chars);
    return r;
}

function decode0(key, enc_string) {
    var decoded_chars = "";
    var i;
    var string = Base64.atob(enc_string);
    for (i = 0; i < string.length; i++) {
        const key_c = key[(i) % key.length];
        const decoded_c = chr((ord(string[i]) - ord(key_c)) % 256);
        decoded_chars = decoded_chars + decoded_c;
    }
    return decoded_chars;
}

export function encode2(key, string) {
    return encode0(key, encode1(key, string))
}

export function decode2(key, string) {
    return decode1(key, decode0(key, string))
}

const decode = (k, s) => (evers === 'e2' ? decode2(k, s) : (evers === "e1" ? decode1(k, s) : decode0(k, s)));
const encode = (k, s) => (evers === 'e2' ? encode2(k, s) : (evers === "e1" ? encode1(k, s) : encode0(k, s)));

// function fetchGET(url, payload = {}, headers = {}) {
//     payload.token = getToken();

//     let qs;
//     if (payload) {
//         qs = '?' + queryString.stringify(payload);
//     } else {
//         qs = ''
//     }
//     return fetch(url + qs, headers);
// }

// function fetchGET_enc(url, payload = {}, headers = {}) {
//     if (url.startsWith(env.profile_server)) {
//     }
//     else {
//         var token = getToken();
//         payload = { token, ever: evers, args: encode(token, JSON.stringify(payload)) }
//     }
//     var qs = '';
//     if (payload) {
//         qs = '?' + queryString.stringify(payload);
//     }
//     return fetch(url + qs, headers).then((R) => R.json())
//         .then((resp) => {
//             //u.log(resp); 
//             if (resp) {
//                 var obj = JSON.parse(decode(token, resp));

//                 if (obj) {
//                     //u.log(obj);
//                     return obj;
//                 }
//             }
//             throw "Fetch Error";
//         });
// }



// function fetchPOST(url, payload = {}) {
//     payload.token = getToken();
//     var params = {
//         method: 'post',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: queryString.stringify(payload)
//     };
//     return fetch(url, params);
// }

function fetchPOST_enc(url, payload = {}) {

    var token = getToken();
    //u.log(url, payload);

    payload = { token, ever: evers, eargs: encode(token, JSON.stringify(payload)) }


    var params = {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: queryString.stringify(payload)
    };
    return fetch(url, params)
        .then((R) => R.json())
        //.then(resp => {console.log(resp); return resp})
        .then((resp) => JSON.parse(decode(token, resp), false))
}

function fetchPOST_enc_params(url, payload = {}) {


    var token = getToken();
    // console.log(token , payload);
    payload = { token, ever: evers, eargs: encode(token, JSON.stringify(payload)) }


    var params = {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: queryString.stringify(payload)
    };
    return fetch(url, params);
}

/**
 *
 * @param {Object} runs - Dict of Piggyback Queries
 */
const fetchPB = (runs) => fetchSRPB({}, runs).then(res => res.piggyback);

/**
 *
 * @param {Array} recs - Array of Set Records
 */
// const fetchSR = (recs) => fetchSRPB(recs, {}).then(res => res.forward);

/**
 *
 * @param {Array} recs - Array of Set Records
 * @param {Object} runs - Dict of Piggyback Queries
 */
const fetchSRPB = (recs, runs) =>
    fetchPOST_enc(env.registrations_server + '/api/v3/qrun', { setrecs: recs, piggyback: runs });


export const fetchAggregates = (qrun) => fetchPB({ qrun }).then(pb => pb.qrun);

// getRestChain: to retrieve multiple runs by passing a chain
/*
 * @param chain Array specifying multiple dicts / runs
 */
const fetchChain = (chain) => fetchPOST_enc(env.registrations_server + '/api/v2/rest/get', { chain })
    .catch((error) => {
        // console.log("Error Retrieving Information: payload:", chain, error);
        throw (error);
    });

// getRestOneRun : to do only one run in the chain
/**
 * @param p Dict specifying a single run
 */
const fetchRecs1 = (run) => fetchChain([run])
    .then((res) => res[0]);

// // getRestSingleRec : to do only one in the chain and retrieve only one record.  typically used for retrieving single records with primary key
// /**
//  * @param p Dict specifying a single run
//  */
// const fetchOneRec = (p) => fetchRecs1({ ...p, l: 1 })
//     .then((ret) => { if (ret.count === 1) { return ret.results[0]; } throw ("Invalid Record"); });


export const fetchRecs = (run) => fetchRecs1(run).then(r => r.results);


/**
 * @param recs Array of dicts - multiple records to be set
 * @param piggyback Array of queries - chain to be run after setting the records.
 */
const setRecs = (recs, piggyback = []) => {
    var payload = {
        recs: JSON.stringify(recs),
        piggyback: JSON.stringify(piggyback),
    };
    return fetchPOST_enc_params(env.registrations_server + '/api/v2/rest/set', payload)
        .then((Response) => Response.json())
        .then(({ success, error, piggyback, piggyback_error }) => {
            if (success !== 'ok') { throw (error); }

            // console.log("PIGGYBACK", piggyback, piggyback_error);
            if (u.isnotnull(piggyback)) {
                return piggyback;
            }
        })
        .catch((error) => {
            // console.log("Error setting rest: ", error);
            throw (error);
        });
}

/**
 * @param rec Dict - a single record to be set
 * @param piggyback Array of queries - chain to be run after setting the records.
 */
// const setOneRec = (rec, piggyback = []) => setRestMultiple([rec], piggyback);

export const setRecsPBOneRun = (recs, run) => setRecs(recs, [run]).then(ret => ret[0].results);




// const pingReg = () => fetch(env.registrations_server + "/reg/");


