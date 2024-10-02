import { call, put } from "redux-saga/effects";
import { AxiosResponse } from "axios";
import { axiosPrivate } from "../../apis/axios";
import { ENDPOINTS } from "./models";
import { IContractData, IContractParams, IDigitalSignature, ILessorApproveRequestResponse, IMetaData, IRentalData, IRentalRequestParams, IReturnHandover, IVehicleHandover, IVehicleHandoverResponseData } from "./types";
import {
  getLesseeContract,
  getLesseeContractFailure,
  getLesseeContractSuccess,
  getLesseeRentRequest,
  getLesseeRentRequestFailure,
  getLesseeRentRequestSuccess,
  getLessorContract,
  getLessorContractFailure,
  getLessorContractSuccess,
  getLessorRentRequest,
  getLessorRentRequestFailure,
  getLessorRentRequestSuccess,
  rentRequest,
  rentRequestFailure,
  rentRequestSuccess,
} from "./reducers";

interface IRentRequestResponse {
  code: number;
  message: string;
  data: IRentalData;
}

interface IListRentRequestResponse {
  code: number;
  message: string;
  data: IRentalData[];
  meta: IMetaData
}

interface IApproveRentRequestResponse {
  code: number;
  message: string;
  data: ILessorApproveRequestResponse;
}

interface IContractResponse {
  code: number;
  message: string;
  data: IContractData[];
  meta: IMetaData
}
interface IContractByIdResponse {
  code: number;
  message: string;
  data: IContractData;
}

interface IVehicleHandoverResponse {
  code: number;
  message: string;
  data: IVehicleHandoverResponseData;
}

export async function handleRentRequest(
  car_id: string,
  rental_start_date: number,
  rental_end_date: number,
  vehicle_hand_over_location: string
) {
  try {
    rentRequest();
    const response: AxiosResponse<IRentRequestResponse> =
      await axiosPrivate.post(ENDPOINTS.RENT_REQUEST, {
        car_id,
        rental_start_date,
        rental_end_date,
        vehicle_hand_over_location,
      });
    const { code, data } = response.data;
    if (code === 200) {
      rentRequestSuccess(data);
      return { success: true, data };
    }
  } catch (error) {
    const typedError = error as Error;
    rentRequestFailure(typedError.message);
    return { success: false, data: null };
  }
}

export function* getLesseeRentRequests(action: {
  type: string;
  payload: IRentalRequestParams;
}) {
  try {
    yield put(getLesseeRentRequest());
    const response: AxiosResponse<IListRentRequestResponse> =
      yield call(axiosPrivate.get, ENDPOINTS.GET_LESSEE_REQUESTS, {
        params: action.payload,
      });
    const { code, data, meta } = response.data;
    if (code === 200) {
      yield put(getLesseeRentRequestSuccess({
        data,
        meta
      }));
    }
  } catch (error) {
    const typedError = error as Error;
    yield put(getLesseeRentRequestFailure(typedError.message));
  }
}

export function* lessorGetRentRequests(action: {
  type: string;
  payload: IRentalRequestParams;
}) {
  try {
    yield put(getLessorRentRequest());
    const response: AxiosResponse<IListRentRequestResponse> =
      yield call(axiosPrivate.get, ENDPOINTS.GET_LESSOR_REQUESTS, {
        params: action.payload,
      });
    const { code, data, meta } = response.data;
    if (code === 200) {
      yield put(getLessorRentRequestSuccess({
        data,
        meta
      }));
    }
  } catch (error) {
    const typedError = error as Error;
    yield put(getLessorRentRequestFailure(typedError.message));
  }
}

export async function rejectRentRequest(request_id: string) {
  try {
    const response: AxiosResponse<IRentRequestResponse> = await axiosPrivate.post(ENDPOINTS.LESSOR_REJECT_REQUEST, {
      request_id,
    })
    const { code, data } = response.data;
    if (code === 200) {
      return { success: true, data };
    }
  } catch (error) {
    console.error(error);
    return { success: false, data: null };
  }
}

export async function approveRentRequest(request_id: string, digital_signature: IDigitalSignature) {
  try {
    const response: AxiosResponse<IApproveRentRequestResponse> = await axiosPrivate.post(ENDPOINTS.LESSOR_APPROVE_REQUEST, {
      request_id,
      digital_signature
    })
    const { code, data } = response.data;
    if (code === 200) {
      return { success: true, data };
    }
  } catch (error) {
    console.error(error);
    return { success: false, data: null };
  }
}

export function* getLesseeContracts(action: {
  type: string;
  payload: IContractParams;
}) {
  try {
    yield put(getLesseeContract());
    const response: AxiosResponse<IContractResponse> = yield call(axiosPrivate.get, ENDPOINTS.GET_LESSEE_CONTRACTS, {
      params: action.payload,
    });
    const { code, data, meta } = response.data;
    if (code === 200) {
      yield put(getLesseeContractSuccess({
        data,
        meta
      }));
    }
  } catch (error) {
    const typedError = error as Error;
    yield put(getLesseeContractFailure(typedError.message));
  }
}

export function* getLessorContracts(action: {
  type: string;
  payload: IContractParams;
}) {
  try {
    yield put(getLessorContract());
    const response: AxiosResponse<IContractResponse> = yield call(axiosPrivate.get, ENDPOINTS.GET_LESSOR_CONTRACTS, {
      params: action.payload,
    });
    const { code, data, meta } = response.data;
    if (code === 200) {
      yield put(getLessorContractSuccess({
        data,
        meta
      }));
    }
  } catch (error) {
    const typedError = error as Error;
    yield put(getLessorContractFailure(typedError.message));
  }
}

export async function getContractById(id: string) {
  try {
    const response: AxiosResponse<IContractByIdResponse> = await axiosPrivate.get(ENDPOINTS.GET_CONTRACT_BY_ID(id))
    const { code, data } = response.data;
    if (code === 200) {
      return { success: true, data };
    }
  } catch (error) {
    const typedError = error as Error;
    console.error(typedError.message);
    return { success: false, data: null };
  }
}

export async function signContract(contract_id: string, digital_signature: IDigitalSignature) {
  try {
    const response: AxiosResponse<IRentRequestResponse> = await axiosPrivate.post(ENDPOINTS.LESSEE_APPROVE_CONTRACT, {
      contract_id,
      digital_signature
    })
    const { code, data } = response.data;
    if (code === 200) {
      return { success: true, data };
    }
  } catch (error) {
    console.error(error);
    return { success: false, data: null };
  }
}

export async function createVehicleHandover (bodyData: IVehicleHandover) {
  try {
    const response: AxiosResponse<IVehicleHandoverResponse>
      = await axiosPrivate.post(ENDPOINTS.CREATE_VEHICLE_HANDOVER, bodyData);
    const { code, data } = response.data;
    if(code === 200) {
      return { success: true, data };
    }
  } catch (error) {
    console.error(error);
    return { success: false, data: null };
  }
}

export async function getVehicleHandoverByContractId (contract_id: string) {
  try {
    const response: AxiosResponse<IVehicleHandoverResponse>
      = await axiosPrivate.get(ENDPOINTS.GET_VEHICLE_HANDOVER_BY_CONTRACT_ID(contract_id));
    const { code, data } = response.data;
    if(code === 200) {
      return { success: true, data };
    }
  } catch (error) {
    console.error(error);
    return { success: false, data: null };
  }
}

export async function lesseeApproveHandover(digital_signature: IDigitalSignature, handover_id: string) {
  try {
    const response: AxiosResponse<IVehicleHandoverResponse> = await axiosPrivate.put(ENDPOINTS.LESSEE_APPROVE_HANDOVER(handover_id), {
      ...digital_signature
    });
    const { code, data } = response.data;
    if(code === 200) {
      return { success: true, data };
    }
  } catch (error) {
    console.error(error);
    return { success: false, data: null };
  }
}

export async function lesseeReturnVehicle(bodyRequest: IReturnHandover, handover_id: string) {
  try {
    const response: AxiosResponse<IVehicleHandoverResponse> = await axiosPrivate.put(ENDPOINTS.LESSEE_RETURN_VEHICLE(handover_id), bodyRequest);
    const { code, data } = response.data;
    if(code === 200) {
      return { success: true, data };
    }
  } catch (error) {
    console.error(error);
    return { success: false, data: null };
  }
}

export async function lessorApproveReturn(digital_signature: IDigitalSignature, handover_id: string) {
  try {
    const response: AxiosResponse<IVehicleHandoverResponse> = await axiosPrivate.put(ENDPOINTS.LESSOR_APPROVE_RETURN(handover_id), {
      ...digital_signature
    });
    const { code, data } = response.data;
    if(code === 200) {
      return { success: true, data };
    }
  } catch (error) {
    console.error(error);
    return { success: false, data: null };
  }
}