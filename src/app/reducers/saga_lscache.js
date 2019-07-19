import { put } from 'redux-saga/effects';
import { LSC_FLUSH_CACHE } from './constants';


export function* flushCache({ db }) {
  yield put({ type: LSC_FLUSH_CACHE, db });
}


