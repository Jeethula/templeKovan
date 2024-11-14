// utils/customFetch.ts
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

const customAxios = axios.create();

// Add request interceptor
customAxios.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('user');
    if (token) {
      try {
        // Check token expiration
        const tokenData = JSON.parse(token);
        const tokenExpiration = new Date(tokenData.exp * 1000);
        if (new Date() > tokenExpiration) {
          // Token expired, clear storage and redirect to login
          localStorage.removeItem('user');
          sessionStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject('Token expired');
        }
        // Add token to headers
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
customAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized, clear storage and redirect to login
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Custom fetch function that wraps axios
export const fetchWithAuth = async (url: string, options: AxiosRequestConfig = {}) => {
  try {
    const response = await customAxios({
      url,
      ...options,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        // Already handled by interceptor
        return Promise.reject(error);
      }
    }
    throw error;
  }
};