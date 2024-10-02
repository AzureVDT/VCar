import axios from "axios";
import axiosRetry from "axios-retry";
import { getAccessToken } from "../utils";
import { API_BASE_URL } from "../config/apiConfig";

const RETRIES = 5;

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Apply axios-retry to the standard axios instance
axiosRetry(axiosInstance, {
  retries: RETRIES, // Number of retry attempts
  retryDelay: axiosRetry.exponentialDelay, // Exponential back-off delay between retries
  retryCondition: (error) => {
    // Retry for specific error codes or conditions
    return error.response ? error.response.status >= 500 : false;
  },
});

export const axiosPrivate = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosPrivate.interceptors.request.use(
  async (config) => {
    try {
      const token = getAccessToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting tokens", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosRetry(axiosPrivate, {
  retries: RETRIES,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return error.response ? error.response.status >= 500 : false;
  },
});
