import axios from 'axios';

const getBaseURL = () => {
  let envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    return import.meta.env.PROD ? 'https://startupforge.onrender.com/api' : '/api';
  }
  let cleanUrl = envUrl.trim().replace(/\/+$/, '');
  if (!cleanUrl.endsWith('/api')) {
    cleanUrl = `${cleanUrl}/api`;
  }
  return cleanUrl;
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
