import type { ApiResponse, GetCommonDto, PaginatedResponse } from '@/types/api.types';
import { apiClient } from './client';
import type { Course, CreateCourseDto, UpdateCourseDto } from '@/types/course.types';


export const courseApi = {
  getAll: async (params: GetCommonDto): Promise<ApiResponse<PaginatedResponse<Course>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Course>>>(
      '/courses/admin',
      { params }
    );
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Course>> => {
    const response = await apiClient.get<ApiResponse<Course>>(`/courses/${id}`);
    return response.data;
  },

  create: async (data: CreateCourseDto): Promise<ApiResponse<Course>> => {
    const response = await apiClient.post<ApiResponse<Course>>('/courses', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCourseDto): Promise<ApiResponse<Course>> => {
    const response = await apiClient.patch<ApiResponse<Course>>(`/courses/${id}`, data);
    return response.data;
  },
};
