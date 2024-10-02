import {call, put} from 'redux-saga/effects';
import {ENDPOINTS} from './models';
import {axiosInstance} from '../../apis/axios';
import {AuthState} from './types';
import {
  loginFailure,
  loginSuccess,
  signupFailure,
  signupSuccess,
} from './reducers';
import {saveTokens} from '../../utils/auth';

interface IResponse {
  code: number;
  message: string;
  data: {
    data: AuthState;
  };
}

function* login(action: {
  type: string;
  payload: {username: string; password: string};
}) {
  try {
    const {username, password} = action.payload;
    const response: IResponse = yield call(
      axiosInstance.post,
      ENDPOINTS.LOGIN,
      {email: username, password},
    );
    yield call(
      saveTokens,
      response.data.data.access_token,
      response.data.data.refresh_token,
    );
    yield put(loginSuccess(response.data.data));
  } catch (error: any) {
    console.log('error:', error.message);
    yield put(loginFailure(error.message));
  }
}

function* signup(action: {
  type: string;
  payload: {name: string; email: string; password: string};
}) {
  try {
    const {name, email, password} = action.payload;
    const response: IResponse = yield call(
      axiosInstance.post,
      ENDPOINTS.SIGN_UP,
      {
        name,
        email,
        password,
      },
    );
    console.log('response signup', response);
    yield put(signupSuccess(response.data.data));
  } catch (error: any) {
    yield put(signupFailure(error.message));
  }
}

function* verifyCode(action: {type: string; payload: {code: string}}) {
  try {
    const {code} = action.payload;
    const response: IResponse = yield call(
      axiosInstance.post,
      ENDPOINTS.VERIFY_EMAIL,
      {code},
    );
    yield call(
      saveTokens,
      response.data.data.access_token,
      response.data.data.refresh_token,
    );
    yield put(loginSuccess(response.data.data));
  } catch (error: any) {
    yield put(loginFailure(error.message));
  }
}

export {login, signup, verifyCode};
