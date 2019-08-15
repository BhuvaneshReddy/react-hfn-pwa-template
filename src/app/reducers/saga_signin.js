import { put, call } from 'redux-saga/effects';
import { USERINFO, LOGINGS } from './constants';
import actions from '../actions/actions';
import u from '../libs/utils';


const updateLoginState = (dict) => (actions.setGS(LOGINGS, dict))
const updateUserInfoDict = (dict) => (actions.mergeCacheDict(USERINFO, dict));
const flushCache = () => actions.signalExit();

export function* processLogIn({ loginBlob, openLoginForm }) {

  yield put(updateLoginState({ openLoginForm }));
  console.log({ openLoginForm });

  if (loginBlob !== null && loginBlob !== undefined) {
    yield put(updateUserInfoDict(loginBlob));

    yield put(flushCache());
  }
}


