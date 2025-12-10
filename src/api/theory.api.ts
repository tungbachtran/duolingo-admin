import type { ApiResponse,  PaginatedResponse } from '@/types/api.types';
import { apiClient } from './client';
import type { CreateTheoryDto, Theory, UpdateTheoryDto } from '@/types/theory.types';


export const theoryApi = {
  getAll: async (unitId: string): Promise<ApiResponse<PaginatedResponse<Theory>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Theory>>>(
      `/theories/admin?unitId=${unitId}`,
    );
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Theory>> => {
    const response = await apiClient.get<ApiResponse<Theory>>(`/theories/${id}`);
    return response.data;
  },

  create: async (data: CreateTheoryDto): Promise<ApiResponse<Theory>> => {
    const response = await apiClient.post<ApiResponse<Theory>>('/theories', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTheoryDto): Promise<ApiResponse<Theory>> => {
    const response = await apiClient.patch<ApiResponse<Theory>>(`/theories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/theories/${id}`);
    return response.data;
  },
};
