import { takeLatest } from "redux-saga/effects";
import {
  getLesseeContracts,
  getLesseeRentRequests,
  getLessorContracts,
  lessorGetRentRequests,
} from "./handlers";
import { GET_LESSEE_CONTRACTS, GET_LESSEE_REQUESTS, GET_LESSOR_CONTRACTS, GET_LESSOR_REQUESTS } from "./action";

function* rentalSaga() {
  yield takeLatest(GET_LESSEE_REQUESTS, getLesseeRentRequests);
  yield takeLatest(GET_LESSOR_REQUESTS, lessorGetRentRequests);
  yield takeLatest(GET_LESSOR_CONTRACTS, getLessorContracts);
  yield takeLatest(GET_LESSEE_CONTRACTS, getLesseeContracts);
}

export default rentalSaga;
