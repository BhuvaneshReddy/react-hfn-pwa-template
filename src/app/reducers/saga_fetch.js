import { put, call } from 'redux-saga/effects';
// import { select } from 'redux-saga/effects';
import { FETCHGS } from './constants';
// import { USERINFO } from './constants';
import actions from '../actions/actions';
import { fetchProfileAPI } from '@heartfulnessinstitute/react-hfn-profile';

// import u from '../libs/utils';

const updateGS = (dict) => (actions.setGS(FETCHGS, dict))

// const getIdToken = (ls) => u.get(ls, [USERINFO, "idToken"], false);

export function* fetchProfile({ api, method, headers, data, gs_result_at }) {

  // const ls = yield select(state => state.localstorage);

  // const idToken = getIdToken(ls);
  // if (!idToken) {
  //   console.log("Error in Fetch API: IDTOKEN is invalid", idToken);
  //   return;
  // }
  try {
    const result = yield call(() => fetchProfileAPI(api, method, headers, data));

    // console.log("fetchProfile response", gs_result_at, result);

    yield put(updateGS({ [gs_result_at]: result }));


  } catch (e) {
    console.log("Error in Fetch API: ", e);
    return;
  }

}


