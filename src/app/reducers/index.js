
import { GS_SET } from './constants';

import u from '../libs/utils';

import ls_reducer from './localstorage';

export const globalstate = (s = {'_vers': 11}, a) => ((a.type === GS_SET) ? ({ ...s, [a.ns]: { ...(u.get(s, a.ns, {})), ...(a.dict) } }) : s);
export const localstorage = (s = {}, a) => ('db' in a) ? ls_reducer(s, a) : s;
