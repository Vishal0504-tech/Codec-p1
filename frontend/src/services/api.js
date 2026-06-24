import axios from 'axios';

// Create an Axios instance pointing to our backend API
const api = axios.create({
  // import.meta.env.VITE_API_URL reads our client-side environment variable.
  // If it is not defined, we fall back to http://localhost:5000/api
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Before sending any request, run this function.
// It checks if user details (and their token) exist in local storage.
// If found, it injects the token as an Authorization Bearer header.
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
