import axios from 'axios';
console.log("VITE_API_BASE_URL value:", import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthUrl = error.config.url.includes('/auth/');
    
    if (error.response && (error.response.status === 401 || error.response.status === 403) && !isAuthUrl) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;