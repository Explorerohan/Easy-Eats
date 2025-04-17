import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with base config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include Firebase token
api.interceptors.request.use(async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      
      if (error.response.status === 401) {
        // Handle unauthorized access
        await AsyncStorage.removeItem('token');
        // You might want to navigate to login screen here
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/api/users/login/', { username: email, password }),
  register: (userData: any) => 
    api.post('/api/users/register/', userData),
};

export const profileAPI = {
  getProfile: (firebase_uid: string) => api.get(`/api/users/${firebase_uid}/get_profile/`),
  updateProfile: (firebase_uid: string, data: FormData) => api.put(`/api/users/${firebase_uid}/update_profile/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export const recipeAPI = {
  getRecipes: () => api.get('/api/recipes/'),
  createRecipe: (data: FormData) => api.post('/api/recipes/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  updateRecipe: (id: number, data: FormData) => api.put(`/api/recipes/${id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deleteRecipe: (id: number) => api.delete(`/api/recipes/${id}/`),
};

export default api; 