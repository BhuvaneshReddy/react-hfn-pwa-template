import {  flushCache  } from './saga_lscache';

import { throttle } from 'redux-saga/effects';
import { LS_TRIGGER_FLUSH } from './constants';

import u from '../libs/utils';

export default function* rootSaga() {

  try {

    // LSCacheHelpers
    yield throttle(1000 * 60, LS_TRIGGER_FLUSH, flushCache);

  } catch (er) {u.log(er)}
}
