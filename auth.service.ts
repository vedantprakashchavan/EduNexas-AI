import api from './api';
import type { AuthResponse, User, ApiResponse } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    return response.data.data!;
  },

  async register(data: { name: string; email: string; password: string; role?: string }): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data!;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/refresh-token');
    return response.data.data!;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data.data!;
  },
};

export const dashboardService = {
  async getStats() {
    const response = await api.get<ApiResponse<any>>('/dashboard/stats');
    return response.data.data;
  },

  async getAlerts() {
    const response = await api.get<ApiResponse<any>>('/dashboard/alerts');
    return response.data.data;
  },

  async getInsights() {
    const response = await api.get<ApiResponse<any>>('/dashboard/insights');
    return response.data.data;
  },
};
