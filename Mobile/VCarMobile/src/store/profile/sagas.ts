import {takeLatest} from 'redux-saga/effects';
import {GET_ME} from './action';
import {getMe} from './handlers';

function* profileSagas() {
  yield takeLatest(GET_ME, getMe);
}

export default profileSagas;
