

import ls_reducer from './localstorage';

export const localstorage = (s = {}, a) => ('db' in a) ? ls_reducer(s, a) : s;
