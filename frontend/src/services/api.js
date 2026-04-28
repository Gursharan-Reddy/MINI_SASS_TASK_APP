import axios from 'axios';

// 1. Setup the base URL for your backend
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// 2. Add the JWT token automatically to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// 3. Define and EXPORT all functions (This is what was missing!)
export const login = (formData) => API.post('/auth/login', formData);

export const signup = (formData) => API.post('/auth/signup', formData); 

export const fetchTasks = () => API.get('/tasks');

export const createTask = (taskData) => API.post('/tasks', taskData);

export const toggleTask = (id) => API.put(`/tasks/${id}`);

export const deleteTask = (id) => API.delete(`/tasks/${id}`);