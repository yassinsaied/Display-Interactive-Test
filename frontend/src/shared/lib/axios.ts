import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { getErrorMessage, isNetworkError } from './errorHandler';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/ld+json',
  },
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      if (isNetworkError(error)) {
        console.error('Network error:', getErrorMessage(error));
      } else if (error.response) {
        const { status } = error.response;
        console.error(`HTTP ${status}:`, getErrorMessage(error));
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
