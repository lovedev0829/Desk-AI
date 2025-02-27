import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { SERVER_URL } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: SERVER_URL, headers: {
  'Content-Type': 'multipart/form-data'
} });

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => res,
  (error: any) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async <T>(args: string | [string, AxiosRequestConfig]): Promise<T> => {
  const [url, config]: [string, AxiosRequestConfig?] = Array.isArray(args) ? args : [args];

  const res: AxiosResponse<T> = await axiosInstance.get<T>(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  transcribe: {
    analyze: '/api/transcribe',
  },
};
