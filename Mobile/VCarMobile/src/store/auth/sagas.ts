import {takeLatest} from 'redux-saga/effects';
import {login, signup, verifyCode} from './handlers';
import {LOGIN, SIGN_UP, VERIFY_CODE} from './actions';

function* authSaga() {
  yield takeLatest(LOGIN, login);
  yield takeLatest(SIGN_UP, signup);
  yield takeLatest(VERIFY_CODE, verifyCode);
}

export default authSaga;
