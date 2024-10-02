import { all, fork } from "redux-saga/effects";
import authSaga from "./auth/sagas";
import carSaga from "./car/sagas";
import rentalSaga from "./rental/sagas";

export function* rootSaga() {
  yield all([fork(authSaga), fork(carSaga), fork(rentalSaga)]);
}
