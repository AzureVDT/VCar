import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuthState} from './types';

const initialState: AuthState = {
  email: '',
  imageUrl: '',
  display_name: '',
  access_token: '',
  refresh_token: '',
  email_verified: false,
  verification_code: '',
  provider: '',
  loading: false,
  error: null,
  isRecheckToken: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: state => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<AuthState>) => {
      state.loading = false;
      state.error = null;
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    signup: state => {
      state.loading = true;
      state.error = null;
    },
    signupSuccess: (state, action: PayloadAction<AuthState>) => {
      state.loading = false;
      state.error = null;
      state.email = action.payload.email;
      state.imageUrl = action.payload.imageUrl;
      state.display_name = action.payload.display_name;
      state.email_verified = action.payload.email_verified;
      state.verification_code = action.payload.verification_code;
      state.provider = action.payload.provider;
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    verifyEmail: (state, action: PayloadAction<AuthState>) => {
      state.loading = true;
      state.error = null;
    },
    verifyEmailSuccess: (state, action: PayloadAction<AuthState>) => {
      state.loading = false;
      state.error = null;
      state.email_verified = true;
    },
    verifyEmailFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.email_verified = false;
    },
    setIsRecheckToken: (state, action: PayloadAction<boolean>) => {
      state.isRecheckToken = action.payload;
    },
  },
});

export const {
  login,
  loginSuccess,
  loginFailure,
  signup,
  signupSuccess,
  signupFailure,
  verifyEmail,
  verifyEmailSuccess,
  verifyEmailFailure,
  setIsRecheckToken,
} = authSlice.actions;
export default authSlice.reducer;
