import { apiClient } from './client';
import { type ApiResponse, type PaginatedResponse } from '../types/api.types';

export interface Unit {
  _id: string;
  courseId: string;
  title?: string;
  description?: string;
  displayOrder: number;
  thumbnail?: string;
  lessons?: Lesson[];
}

export interface Lesson {
  _id: string;
  unitId: string;
  title?: string;
  objectives?: string;
  displayOrder: number;
  thumbnail?: string;
}

export interface CreateUnitDto {
  courseId: string;
  title?: string;
  description?: string;
  thumbnail?: string;
}

export interface UpdateUnitDto {
  title?: string;
  description?: string;
  thumbnail?: string;
}

export const unitApi = {
  getAll: async (courseId: string): Promise<ApiResponse<PaginatedResponse<Unit>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Unit>>>(
      `/units/admin?courseId=${courseId}`
    );
    return response.data;
  },

  getByCourseId: async (id: string): Promise<ApiResponse<PaginatedResponse<Unit>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Unit>>>(`/units/course/${id}`);
    return response.data;
  },
  getById: async (id: string): Promise<ApiResponse<Unit>> => {
    const response = await apiClient.get<ApiResponse<Unit>>(`/units/${id}`);
    return response.data;
  },

  create: async (data: CreateUnitDto): Promise<ApiResponse<Unit>> => {
    const response = await apiClient.post<ApiResponse<Unit>>('/units', data);
    return response.data;
  },

  update: async (id: string, data: UpdateUnitDto): Promise<ApiResponse<Unit>> => {
    const response = await apiClient.patch<ApiResponse<Unit>>(`/units/${id}`, data);
    return response.data;
  },
};
