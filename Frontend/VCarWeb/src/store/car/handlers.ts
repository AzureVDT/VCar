import { call, put } from "redux-saga/effects";
import { CarDetail, ICar, IQuerySearchCar } from "./types";
import { axiosInstance } from "../../apis/axios";
import { ENDPOINTS } from "./models";
import {
  getCarDetailFailed,
  getCarDetailSuccess,
  getCars,
  getCarsFailed,
  getCarsSuccess,
} from "./reducers";
import { AxiosResponse } from "axios";

interface ICarResponse {
  code: number;
  message: string;
  data: ICar[];
}

interface ICarDetailResponse {
  code: number;
  message: string;
  data: CarDetail;
}

function* searchCar(action: {
  type: string;
  payload: IQuerySearchCar;
}) {
  try {
    yield put(getCars());
    const response: AxiosResponse<ICarResponse> = yield call(
      axiosInstance.get,
      ENDPOINTS.SEARCH,
      {
        params: action.payload,
      }
    );
    yield put(getCarsSuccess(response.data.data));
  } catch (error) {
    const typedError = error as Error;
    yield put(getCarsFailed(typedError.message));
  }
}

function* getCarDetail(action: { type: string; payload: string }) {
  try {
    const response: AxiosResponse<ICarDetailResponse> = yield call(
      axiosInstance.get,
      ENDPOINTS.FIND_CAR_BY_ID(action.payload)
    );
    yield put(getCarDetailSuccess(response.data.data));
  } catch (error) {
    const typedError = error as Error;
    yield put(getCarDetailFailed(typedError.message));
  }
}

export { searchCar, getCarDetail };
