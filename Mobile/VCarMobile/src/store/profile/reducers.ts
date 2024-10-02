import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IUser} from './types';

export interface ProfileState {
  me: IUser;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  me: {} as IUser,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    getMe(state) {
      state.loading = true;
      state.error = null;
    },
    getMeSuccess(state, action: PayloadAction<IUser>) {
      state.loading = false;
      state.me = action.payload;
      state.error = null;
    },
    getMeFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {getMe, getMeSuccess, getMeFailed} = profileSlice.actions;
export default profileSlice.reducer;
