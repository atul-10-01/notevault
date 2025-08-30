import axios, { type AxiosResponse } from 'axios';
import type { AuthResponse, SignupData, LoginData } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Register user and send OTP
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/signup', data);
    return response.data;
  },

  // Verify OTP after signup
  verifyOTP: async (email: string, otp: string): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/verify-otp', {
      email,
      otp,
    });
    return response.data;
  },

  // Login with email (sends OTP)
  requestOTP: async (email: string): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', {
      email,
    });
    return response.data;
  },

  // Verify login OTP
  verifyLoginOTP: async (data: LoginData): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/verify-login-otp', data);
    return response.data;
  },

  // Resend OTP
  resendOTP: async (email: string, type: 'email_verification' | 'login'): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/resend-otp', {
      email,
      type,
    });
    return response.data;
  },

  // Google OAuth login
  googleAuth: async (token: string): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/google', {
      token,
    });
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};

export default api;
