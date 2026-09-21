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
  timeout: 15000,
});

// In-Memory Fast Response Cache for GET endpoints
const cache = new Map();
const CACHE_TTL = 60 * 1000; // 60 seconds TTL

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Cache hit for public GET requests
  if (config.method === 'get') {
    const key = config.url + JSON.stringify(config.params || {});
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      config.adapter = () => Promise.resolve({
        data: cached.data,
        status: 200,
        statusText: 'OK (Cached)',
        headers: {},
        config,
      });
    }
  }

  return config;
});

api.interceptors.response.use((response) => {
  if (response.config.method === 'get' && response.status === 200) {
    const key = response.config.url + JSON.stringify(response.config.params || {});
    cache.set(key, { data: response.data, timestamp: Date.now() });
  }
  return response;
});

// Background Keep-Alive Ping to prevent Render cold-start sleeps
if (typeof window !== 'undefined') {
  setTimeout(() => {
    fetch(`${getBaseURL()}/health`).catch(() => {});
  }, 1000);
}

export default api;
