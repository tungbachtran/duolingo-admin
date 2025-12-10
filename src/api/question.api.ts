import type { ApiResponse, GetCommonDto, PaginatedResponse } from '@/types/api.types';
import { apiClient } from './client';
import type { CreateQuestionDto, Question, UpdateQuestionDto } from '@/types/question.types';


export const questionApi = {
  getAll: async (lessonId:string): Promise<ApiResponse<PaginatedResponse<Question>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Question>>>(
      `/questions/admin?lessonId=${lessonId}`,
    );
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Question>> => {
    const response = await apiClient.get<ApiResponse<Question>>(`/questions/${id}`);
    return response.data;
  },

  create: async (data: CreateQuestionDto): Promise<ApiResponse<Question>> => {
    const response = await apiClient.post<ApiResponse<Question>>('/questions', data);
    return response.data;
  },

  update: async (id: string, data: UpdateQuestionDto): Promise<ApiResponse<Question>> => {
    const response = await apiClient.put<ApiResponse<Question>>(`/questions/${id}`, data);
    return response.data;
  },
};
