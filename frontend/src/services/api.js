import axios from 'axios';

// 1. Check if the environment variable exists. 
// If it's undefined (like on your local machine), it falls back to localhost.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({ baseURL: BASE_URL });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Export your API functions...
export const login = (formData) => API.post('/auth/login', formData);
export const signup = (formData) => API.post('/auth/signup', formData);
export const fetchTasks = () => API.get('/tasks');
export const createTask = (taskData) => API.post('/tasks', taskData);
export const toggleTask = (id) => API.put(`/tasks/${id}`);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);