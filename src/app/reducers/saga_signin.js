import { put, call } from 'redux-saga/effects';
import { USERINFO, LSC_FLUSH_CACHE, LOGINGS } from './constants';
import actions from '../actions/actions';


const updateLoginState = (dict) => (actions.setGS(LOGINGS, dict))
const updateUserInfoDict = (dict) => (actions.mergeCacheDict(USERINFO, dict));
const flushCache = () => actions.signalExit();

export function* processLogIn({ loginBlob, openLoginForm }) {

  yield put(updateLoginState({ openLoginForm }));
  console.log({ openLoginForm });

  if (loginBlob !== null && loginBlob !== undefined) {
    const { uid, myInfo } = loginBlob;
    yield put(updateUserInfoDict({ uid, myInfo }));

    yield put(flushCache());
  }
}


