import { put, call } from 'redux-saga/effects';
import { USERINFO, LSC_FLUSH_CACHE } from './constants';
import actions from '../actions/actions';



const updateUserInfoDict = (dict) => (actions.mergeCacheDict(USERINFO, dict));
const flushCache = () => actions.signalExit();

export function* processLogIn({ loginBlob }) {
  const { loginState, myInfo } = loginBlob;
  yield put(updateUserInfoDict({ loginState, myInfo, loginBlob }));

  yield put(flushCache());
}


