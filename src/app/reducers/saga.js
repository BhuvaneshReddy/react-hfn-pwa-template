import {  flushCache  } from './saga_lscache';

import { processLogIn } from './saga_signin';
import { put, takeEvery, throttle } from 'redux-saga/effects';
import { LS_TRIGGER_FLUSH, LSC_HYDRATE_CACHE, LOGIN_PROCESS_IT, USERINFO, FETCH_PROFILE } from './constants';
// import { bulkPutDB } from './saga_dbsyncer';

import u from '../libs/utils';
import { fetchProfile } from './saga_fetch';

export default function* rootSaga() {

  try {

    // LSCacheHelpers
    yield throttle(1000 * 60, LS_TRIGGER_FLUSH, flushCache);

    // SignInHelpers
    yield put({ type: LSC_HYDRATE_CACHE, db: USERINFO });
    yield takeEvery(LOGIN_PROCESS_IT, processLogIn);

    // fetch Data Requests
    yield takeEvery(FETCH_PROFILE, fetchProfile);


  } catch (er) {u.log(er)}
}
