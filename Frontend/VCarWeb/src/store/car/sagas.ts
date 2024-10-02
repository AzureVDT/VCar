import {takeLatest} from 'redux-saga/effects';
import {getCarDetail, searchCar} from './handlers';
import {GET_CAR_BY_ID, GET_CARS} from './action';

function* carSaga() {
  yield takeLatest(GET_CARS, searchCar);
  yield takeLatest(GET_CAR_BY_ID, getCarDetail);
}

export default carSaga;
