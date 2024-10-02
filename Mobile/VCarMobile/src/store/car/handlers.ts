import {call, put} from 'redux-saga/effects';
import {CarDetail, ICar} from './types';
import {axiosInstance} from '../../apis/axios';
import {ENDPOINTS, QuerySearchCar} from './models';
import {
  getCarDetailFailed,
  getCarDetailSuccess,
  getCars,
  getCarsFailed,
  getCarsSuccess,
} from './reducers';

interface ICarResponse {
  code: number;
  message: string;
  data: {
    data: ICar[];
  };
}

interface ICarDetailResponse {
  code: number;
  message: string;
  data: {
    data: CarDetail;
  };
}

function* searchCar(action: {type: string; payload: any}) {
  try {
    yield put(getCars());
    const response: ICarResponse = yield call(
      axiosInstance.get,
      ENDPOINTS.SEARCH,
      {
        params: action.payload,
      },
    );
    yield put(getCarsSuccess(response.data.data));
  } catch (error: any) {
    yield put(getCarsFailed(error.message));
  }
}

function* getCarDetail(action: {type: string; payload: string}) {
  try {
    const response: ICarDetailResponse = yield call(
      axiosInstance.get,
      ENDPOINTS.FIND_CAR_BY_ID(action.payload),
    );
    yield put(getCarDetailSuccess(response.data.data));
  } catch (error: any) {
    yield put(getCarDetailFailed(error.message));
  }
}

export {searchCar, getCarDetail};
