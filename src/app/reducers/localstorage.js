import { Base64 } from 'js-base64';
import u from '../libs/utils';
import deepmerge from '../libs/deepmerge';
import { LSC_UPDATE_LS_DICT, LSC_UPDATE_LS_DICT_DEEP, LSC_HYDRATE_CACHE, LSC_FLUSH_CACHE, LSC_RESET_CACHE } from './constants';

const env = {
    prod_str: process.env.NODE_ENV === 'production' ? 'p' : 'd'
}

function encode2(string) {
    return Base64.encode(string);
}

function decode2(enc_string) {
    return Base64.decode(enc_string);
}

// =============
/// CACHE FUNCTIONS
// =============
const __vers = 1;

var init_cache = () => ({ __vers });
const getFromCache = (CACHE_KEY) => {
    try {
        // u.log("entered cache");
        const ck = CACHE_KEY + (env.prod_str);
        var v = init_cache().__vers;
        // u.log(v);
        var g = localStorage.getItem(ck);
        if ((typeof g) === 'string') {

            var x = JSON.parse(decode2(g));
            // u.log(v, x.__vers, x);
            if (v !== x.__vers) {
                // u.log("AA 4");
                return init_cache();
            }

            // u.log("AA 1");
            return x;
        } else {
            // u.log("AA 2");
            return init_cache();
        }
    } catch (error) {
        u.log("error cache AA 3");
        return init_cache();
    }
};

const writeToCache = (CACHE_KEY, data) => {
    try {
        const ck = CACHE_KEY + (env.prod_str);
        localStorage.setItem(ck, encode2(JSON.stringify(data)));
        //u.log("wrote cache");

    } catch (error) {
    }
}

const hydrated = (s, c) => ((c + "_hydrated" in s) ? s : { ...s, [c]: getFromCache(c), [c + "_hydrated"]: true });

const is_hydrated = (s, c) => (c + "_hydrated") in s;

export default  (state = {}, action) => {
    const { db } = action;    
    switch (action.type) {
        
        case LSC_UPDATE_LS_DICT:
            return { ...(state),  [db]: { ...(state[db]), ...(action.dict) } };

        case LSC_UPDATE_LS_DICT_DEEP:
            return deepmerge(state, { [db]: action.dict });
                    
        case LSC_HYDRATE_CACHE:
            // u.log("LSC_HYDRATE_CACHE", db, { ...state });
            return hydrated(state, db);
            // u.log("LSC_HYDRATE_CACHE", db, { ...newstate });

        case LSC_FLUSH_CACHE:
            // u.log("FLUSH", db);
            Object.keys(state)
                .filter(k => is_hydrated(state, k))
                .map(c => writeToCache(c, state[c]));
            
            // u.log(state);
            return state;
        
        case LSC_RESET_CACHE:
            try {
                var newstate = { ...state };
                newstate[db] = init_cache();
                newstate[db + "_hydrated"] = true;
                u.log("RESET", db, newstate[db]);
                writeToCache(db, newstate[db]);
                return newstate;
            } catch(er) {u.log(er)}
        

        default:
            return state;
    }
};