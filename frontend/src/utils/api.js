import axios from 'axios';

const api = axios.create({
baseURL: (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'),
timeout: 10000,
});

api.interceptors.response.use(
(r) => r,
(error) => {
const message = error?.response?.data?.error || error?.message || 'Unknown error';
return Promise.reject(new Error(message));
}
);

export default api;