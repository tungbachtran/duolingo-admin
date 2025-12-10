import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import { apiClient } from './client';
import type { Lesson } from './unit.api';


export interface CreateLessonDto {
  unitId: string;
  title?: string;
  experiencePoint?:number
  objectives?: string;
  thumbnail?: string;
}

export interface UpdateLessonDto {
  title?: string;
  experiencePoint?:number;
  objectives?: string;
  thumbnail?: string;
}

export const lessonApi = {
  getAll: async (unitId:string): Promise<ApiResponse<PaginatedResponse<Lesson>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Lesson>>>(
      `/lessons/admin?unitId=${unitId}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Lesson>> => {
    const response = await apiClient.get<ApiResponse<Lesson>>(`/lessons/${id}`);
    return response.data;
  },

  create: async (data: CreateLessonDto): Promise<ApiResponse<Lesson>> => {
    const response = await apiClient.post<ApiResponse<Lesson>>('/lessons', data);
    return response.data;
  },

  update: async (id: string, data: UpdateLessonDto): Promise<ApiResponse<Lesson>> => {
    const response = await apiClient.patch<ApiResponse<Lesson>>(`/lessons/${id}`, data);
    return response.data;
  },
};
