import {
    GS_SET, LSC_FLUSH_CACHE,
    LSC_UPDATE_LS_DICT, LSC_UPDATE_LS_DICT_DEEP, LSC_RESET_CACHE,
    LOGIN_PROCESS_IT, USERINFO,
    LSC_HYDRATE_CACHE,
    FETCH_PROFILE,
    INIT_FIREBASE
} from '../reducers/constants';

export default {

    setGS: (ns, d) => ({
        type: GS_SET, ns, dict: d
    }),

    initPS: (ns) => ({
        type: LSC_HYDRATE_CACHE, db: ns
    }),

    setPS: (ns, d) => ({
        type: LSC_UPDATE_LS_DICT, db: ns, dict: d
    }),


    signalExit: () => ({
        type: LSC_FLUSH_CACHE, db: "*"
    }),


    initCache: (db) => ({
        type: LSC_HYDRATE_CACHE, db
    }),


    setCacheKey: (db, k, v) => ({
        type: LSC_UPDATE_LS_DICT,
        db,
        dict: { [k]: v }
    }),

    mergeCacheDict: (db, dict) => ({
        type: LSC_UPDATE_LS_DICT,
        db,
        dict
    }),

    deepmergeCacheDict: (db, dict) => ({
        type: LSC_UPDATE_LS_DICT_DEEP,
        db,
        dict
    }),

    doLogin: (loginBlob) => ({
        type: LOGIN_PROCESS_IT,
        loginBlob, openLoginForm: false 
    }),
    doLogout: () => ({
        type: LSC_RESET_CACHE,
        db: USERINFO
    }),

    setLoginForm: () => ({
        type: LOGIN_PROCESS_IT,
        openLoginForm: true
    }),

    cancelLoginForm: () => ({
        type: LOGIN_PROCESS_IT,
        openLoginForm: false
    }),

    fetchProfile: (api, data, gs_result_at) => ({
        type: FETCH_PROFILE,
        api, data, gs_result_at
    }),

    initFirebase: () => ({
        type: INIT_FIREBASE
    }),
}


