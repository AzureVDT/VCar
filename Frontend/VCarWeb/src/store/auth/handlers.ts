import { ENDPOINTS } from "./models";
import { axiosInstance } from "../../apis/axios";
import { ILoginResponse, IUser } from "./types";
import { loginFailure, loginRequest, loginSuccess } from "./reducers";
import { AxiosResponse } from "axios";
import {
  saveAccessToken,
  saveRefreshToken,
  saveUserInfoToCookie,
} from "../../utils";

// function* login(action: {
//   type: string;
//   payload: { email: string; password: string };
// }) {
//   try {
//     const { email, password } = action.payload;
//     yield put(loginRequest());
//     const response: AxiosResponse<ILoginResponse> = yield call(
//       axiosInstance.post,
//       ENDPOINTS.LOGIN,
//       { email, password }
//     );
//     if (response.data.code === 200) {
//       const {
//         access_token,
//         refresh_token,
//         id,
//         display_name,
//         email,
//         image_url,
//       } = response.data.data;
//       const user = {
//         id,
//         display_name,
//         email,
//         image_url,
//       };
//       saveAccessToken(access_token);
//       saveRefreshToken(refresh_token);
//       saveUserInfoToCookie(user, access_token);
//       yield put(loginSuccess(user));
//     }
//   } catch (error) {
//     const typedError = error as Error;
//     console.log("error:", typedError.message);
//     yield put(loginFailure(typedError.message));
//   }
// }

async function login(email: string, password: string) {
  try {
    loginRequest();
    const response: AxiosResponse<ILoginResponse> =
      await axiosInstance.post(ENDPOINTS.LOGIN, { email, password });
    if (response.data.code === 200) {
      const {
        access_token,
        refresh_token,
        id,
        display_name,
        email,
        image_url,
      } = response.data.data;
      const user = {
        id,
        display_name,
        email,
        image_url,
      };
      saveAccessToken(access_token);
      saveRefreshToken(refresh_token);
      loginSuccess(user);
      return {
        success: response.data.code === 200,
        token: access_token,
      };
    }
  } catch (error) {
    const typedError = error as Error;
    loginFailure(typedError.message);
    return { success: false, token: null };
  }
}

export { login };
