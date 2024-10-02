import {combineReducers, configureStore} from '@reduxjs/toolkit';

import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';
import authSlice from './auth/reducers';
import carSlice from './car/reducers';
import profileSlice from './profile/reducers';

const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers({
  auth: authSlice,
  car: carSlice,
  profile: profileSlice,
});

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof reducer>;

export default store;
