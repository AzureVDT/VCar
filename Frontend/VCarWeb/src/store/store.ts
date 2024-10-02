import { configureStore, combineReducers } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "./rootSaga"; // Import the combined sagas
import authSlice from "./auth/reducers";
import carSlice from "./car/reducers";
import rentalSlice from "./rental/reducers";
import profileSlice from "./profile/reducers";

const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers({
  auth: authSlice,
  car: carSlice,
  rental: rentalSlice,
  profile: profileSlice,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
