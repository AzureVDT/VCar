import Cookies from "js-cookie";
import { ethers } from 'ethers';
import { jwtDecode } from "jwt-decode";
import { IUser } from "../store/auth/types";
import CryptoJS from "crypto-js";
import numeral from "numeral";
import moment from "moment";
import { message } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { setUploadProgress } from "../store/rental/reducers";
import { AppDispatch } from "../store/store";
import { RefObject } from "react";
import SignatureCanvas from 'react-signature-canvas';
import { CitizenIdentificationData, LicenseData } from "../store/profile/types";

const accessTokenKey = "VCAR_ACCESS_TOKEN";
const refreshTokenKey = "VCAR_REFRESH_TOKEN";
const userKey = "VCAR_USER";

const objCookies = {
  expires: 30,
  domain:
    typeof window !== "undefined"
      ? window.location.hostname
      : "localhost",
};

export const saveAccessToken = (access_token: string) => {
  if (access_token) {
    Cookies.set(accessTokenKey, access_token, {
      ...objCookies,
    });
  } else {
    Cookies.remove(accessTokenKey, {
      ...objCookies,
      path: "/",
      domain:
        typeof window !== "undefined"
          ? window.location.hostname
          : "localhost",
    });
  }
};

export const saveRefreshToken = (refresh_token: string) => {
  if (refresh_token) {
    Cookies.set(refreshTokenKey, refresh_token, {
      ...objCookies,
    });
  } else {
    Cookies.remove(refreshTokenKey, {
      ...objCookies,
      path: "/",
      domain:
        typeof window !== "undefined"
          ? window.location.hostname
          : "localhost",
    });
  }
};

export const saveUser = (id: string) => {
  if (id) {
    Cookies.set(userKey, id, {
      ...objCookies,
    });
  } else {
    Cookies.remove(userKey, {
      ...objCookies,
      path: "/",
      domain: window.location.hostname,
    });
  }
};

export const getAccessToken = () => {
  const access_token = Cookies.get(accessTokenKey);
  return access_token;
};

export const getRefreshToken = () => {
  const refresh_token = Cookies.get(refreshTokenKey);
  return refresh_token;
};

export const getUser = () => {
  const user = Cookies.get(userKey);
  return user;
};

export const isTokenExpire = (token: string) => {
  if (!token) return true;
  const decodedToken = jwtDecode(token);

  const currentTime = Math.floor(Date.now() / 1000);

  if (decodedToken.exp && decodedToken.exp < currentTime) {
    return true;
  } else {
    return false;
  }
};

export function getUserInfoFromCookie() {
  const accessToken = getAccessToken();
  const encryptedUser = getUser();
  let decryptedData: IUser = {} as IUser;
  if (encryptedUser && accessToken) {
    const bytes = CryptoJS.AES.decrypt(encryptedUser, accessToken);
    decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  return decryptedData;
}

export function saveUserInfoToCookie(
  user: IUser,
  accessToken: string
) {
  const cipherText = CryptoJS.AES.encrypt(
    JSON.stringify(user),
    accessToken
  ).toString();
  saveUser(cipherText);
}

export const formatPrice = (price: number) => {
  return numeral(price).format("0,0");
};

export const formatDate = (date: string) => {
  // using moment to format timestamp to dd/mm/yyyy hh:mm
  return moment(date).format("DD/MM/YYYY HH:mm");
};

export const convertDateToTimestamp = (date: string) => {
  return moment(date).valueOf();
}

export const calculateDays = (
  startTimestamp: number | null,
  endTimestamp: number | null
): number => {
  if (startTimestamp === null || endTimestamp === null) {
    return 0;
  }
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const differenceInMilliseconds = endTimestamp - startTimestamp;
  const numberOfDays = differenceInMilliseconds / millisecondsPerDay;
  return parseFloat(numberOfDays.toFixed(1));
};

export const handleMetaMaskSignature = async (username: string) => {
  if (window?.ethereum && username) {
      try {
          const provider = new ethers.BrowserProvider(window?.ethereum);
          const accounts = await provider.send("eth_requestAccounts", []);
          const account = accounts[0];
          const message = `Approve rental request for ${username}`;
          const signature = await provider.send("personal_sign", [message, account]);
          return {
              account,
              signature,
              msg: message,
          };
      } catch (error) {
          console.error(error);
          message.error('Failed to sign with MetaMask');
      }
  } else {
      message.error('MetaMask is not installed or user data is missing');
  }
};

export const fetchImageFromUrl = async (url: string): Promise<ArrayBuffer> => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return response.data;
  } catch (error) {
    console.error('Error fetching image from URL:', error);
    throw error;
  }
};

export async function handleUploadSignature(sigCanvas: RefObject<SignatureCanvas>, dispatch: AppDispatch, rental_contract_id: string, userId: string, setLoading: (value: boolean) => void) {
  try {
    const dataUrl = sigCanvas?.current?.getTrimmedCanvas()?.toDataURL('image/png');
    const blob = await (await fetch(dataUrl)).blob();
    // Check if the blob size exceeds 10MB
    const size = blob.size / 1024 / 1024;
    if (size > 10) {
      message.error("File size must be less than 10MB");
      setLoading(false);
      return;
    }
    const timestamp = Date.now();
    const fileName = `signature_${userId}_${timestamp}.png`;

    const formData = new FormData();
    formData.append('file', blob, fileName);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET_NAME || '');
    formData.append('public_id', fileName);
    formData.append('folder', `contracts/${rental_contract_id}`);
    const imageUrl = await handleUploadFile(formData, dispatch);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading signature:", error);
    return '';
  }
}

export const handleRecognizeLicensePlate = async (formData: FormData) => {
  try {
    const response = await axios.post(
        "https://api.fpt.ai/vision/dlr/vnm",
        formData,
        {
            headers: {
                "api-key": import.meta.env.VITE_FPT_KYC_SECRET_KEY,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    console.log("handleRecognizeLicensePlate ~ response:", response.data);
    console.log("handleRecognizeLicensePlate ~ response:", response.data.data.at(0));
    
    if (response?.data?.data) {
        return {success: true, data: response.data.data.at(0) as LicenseData};
    }
  } catch (error) {
    console.error("Error during recognition:", error);
    return {success: false, data: null};
  }
}

export const handleRecognizeCitizenIdentification = async (formData: FormData) => {
  try {
    const response = await axios.post(
        "https://api.fpt.ai/vision/idr/vnm",
        formData,
        {
            headers: {
                "api-key": import.meta.env.VITE_FPT_KYC_SECRET_KEY,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    console.log("handleRecognizeCitizenIdentification ~ response:", response.data);
    console.log("handleRecognizeCitizenIdentification ~ response:", response.data.data.at(0));
    
    if (response?.data?.data) {
        return {success: true, data: response.data.data.at(0) as CitizenIdentificationData};
    }
  } catch (error) {
    console.error("Error during recognition:", error);
    return {success: false, data: null};
  }
}

export const handleUploadFile = async (
  formData: FormData,
  dispatch: AppDispatch
) => {
  try {
      const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
          formData,
          {
              onUploadProgress: (progressEvent) => {
                  if (typeof progressEvent.total === "number") {
                      const percentCompleted = Math.round(
                          (progressEvent.loaded * 100) / progressEvent.total
                      );
                      dispatch(setUploadProgress(percentCompleted));
                  } else {
                      toast.warn("Total size is undefined.");
                      dispatch(setUploadProgress(0));
                  }
              },
          }
      );
      const imageUrl = response.data.secure_url;
      if (imageUrl) {
          return imageUrl;
      }
  } catch (error) {
      console.error("Error uploading file:", error);
  }
};

// export const handleDeleteFile = async (fileUrl: string) => {
//   try {
//       const urlParts = fileUrl.split("/");
//       const fileName = urlParts[urlParts.length - 1];
//       const [publicId] = fileName.split(".");
//       const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
//       const timestamp = new Date().getTime();
//       const signature = generateSHA1(
//           generateSignature(
//               publicId,
//               process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET as string,
//               timestamp
//           )
//       );

//       const response = await axiosInstance.post(
//           `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
//           {
//               public_id: publicId,
//               timestamp,
//               api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
//               signature,
//           }
//       );
//       console.log("handleDeleteFile ~ response:", response);

//       // Check the response
//       if (response.data.result === "ok") {
//           return true;
//       } else {
//           return false;
//       }
//   } catch (error) {
//       console.error("Error deleting file:", error);
//   }
// };