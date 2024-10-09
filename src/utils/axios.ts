import axios, { AxiosRequestConfig } from 'axios';

import { BACKEND_URL } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: BACKEND_URL });

axiosInstance.interceptors.response.use(
  res => res,
  error =>
    Promise.reject(
      (error.response && error.response.data) || 'Something went wrong'
    )
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
    profile: '/api/auth/profile',
    changePassword: '/api/auth/change-password',
  },
  upload: '/api/file/upload',
  user: '/api/user',
  reservation: '/api/reservation',
  consumption: '/api/consumption',
  payment: {
    root: '/api/payment',
    latest: '/api/payment-latest',
  },
};
