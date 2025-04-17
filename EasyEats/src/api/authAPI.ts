import axios from 'axios';
import { API_URL } from '../config';
import { getAuth } from 'firebase/auth';

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

const authAPI = {
    createProfile: async (profileData: {
        firebase_uid: string;
        email: string;
        first_name?: string;
        last_name?: string;
        bio?: string;
        location?: string;
        profile_picture?: string;
    }) => {
        try {
            console.log('Creating profile with data:', profileData);
            const response = await api.post('/api/users/create_profile/', profileData);
            console.log('Profile created successfully:', response.data);
            return response;
        } catch (error) {
            console.error('Error creating profile:', error);
            if (axios.isAxiosError(error)) {
                console.error('Axios error details:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
            }
            throw error;
        }
    },

    getProfile: async (firebase_uid: string) => {
        try {
            console.log('Fetching profile for:', firebase_uid);
            const response = await api.get(`/api/users/${firebase_uid}/get_profile/`);
            console.log('Profile fetched successfully:', response.data);
            return response;
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (axios.isAxiosError(error)) {
                console.error('Axios error details:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
            }
            throw error;
        }
    },

    updateProfile: async (firebase_uid: string, profileData: {
        first_name?: string;
        last_name?: string;
        email?: string;
        bio?: string;
        location?: string;
        profile_picture?: string;
    }) => {
        try {
            console.log('Updating profile for:', firebase_uid, 'with data:', profileData);
            const response = await api.put(`/api/users/${firebase_uid}/update_profile/`, profileData);
            console.log('Profile updated successfully:', response.data);
            return response;
        } catch (error) {
            console.error('Error updating profile:', error);
            if (axios.isAxiosError(error)) {
                console.error('Axios error details:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
            }
            throw error;
        }
    }
};

export default authAPI; 