import { IContractData, IMetaData, IRentalData, IRentalState } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IRentalState = {
  loading: false,
  error: null,
  lesseeRequest: {} as IRentalData,
  lessorListRequest: {
    data: [],
    meta: {} as IMetaData
  },
  lesseeListRequest: {
    data: [],
    meta: {} as IMetaData
  },
  lesseeListContract: {
    data: [],
    meta: {} as IMetaData
  },
  lessorListContract: {
    data: [],
    meta: {} as IMetaData
  },
  uploadProgress: 0,
};

const rentalSlice = createSlice({
  name: "rental",
  initialState,
  reducers: {
    rentRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    rentRequestSuccess: (
      state,
      action: PayloadAction<IRentalData>
    ) => {
      state.loading = false;
      state.lesseeRequest = action.payload;
    },
    rentRequestFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    getLesseeRentRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getLesseeRentRequestSuccess(
      state,
      action: PayloadAction<{
          data: IRentalData[];
          meta: IMetaData;
        }>
    ) {
      state.loading = false;
      state.lesseeListRequest = action.payload;
    },
    getLesseeRentRequestFailure(
      state,
      action: PayloadAction<string>
    ) {
      state.loading = false;
      state.error = action.payload;
    },
    getLessorRentRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getLessorRentRequestSuccess(
      state,
      action: PayloadAction<{
        data: IRentalData[];
        meta: IMetaData;
      }>
    ) {
      state.loading = false;
      state.lessorListRequest = action.payload;
    },
    getLessorRentRequestFailure(
      state,
      action: PayloadAction<string>
    ) {
      state.loading = false;
      state.error = action.payload;
    },
    getLesseeContract (state) {
      state.loading = true;
      state.error = null;
    },
    getLesseeContractSuccess (
      state,
      action: PayloadAction<{
        data: IContractData[];
        meta: IMetaData;
      }>
    ) {
      state.loading = false;
      state.lesseeListContract = action.payload;
    },
    getLesseeContractFailure (
      state,
      action: PayloadAction<string>
    ) {
      state.loading = false;
      state.error = action.payload;
    },
    getLessorContract (state) {
      state.loading = true;
      state.error = null;
    },
    getLessorContractSuccess (
      state,
      action: PayloadAction<{
        data: IContractData[];
        meta: IMetaData;
      }>
    ) {
      state.loading = false;
      state.lessorListContract = action.payload;
    },
    getLessorContractFailure (
      state,
      action: PayloadAction<string>
    ) {
      state.loading = false;
      state.error = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
  },
});

export const {
  rentRequest,
  rentRequestSuccess,
  rentRequestFailure,
  getLesseeRentRequest,
  getLesseeRentRequestSuccess,
  getLesseeRentRequestFailure,
  getLessorRentRequest,
  getLessorRentRequestSuccess,
  getLessorRentRequestFailure,
  getLesseeContract,
  getLesseeContractSuccess,
  getLesseeContractFailure,
  getLessorContract,
  getLessorContractSuccess,
  getLessorContractFailure,
  setUploadProgress,
} = rentalSlice.actions;

export default rentalSlice.reducer;
