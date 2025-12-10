import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionApi } from '../api/question.api';
import { type CreateQuestionDto, type UpdateQuestionDto } from '../types/question.types';
import { toast } from './use-toast';
import { handleApiError } from '../api/client';

export const useQuestions = (lessonId: string) => {
 

  return useQuery({
    queryKey: ['questions', lessonId],
    queryFn: () => questionApi.getAll(lessonId),
    select: (data) => data.value,
  });
};

export const useQuestion = (id: string) => {
  return useQuery({
    queryKey: ['question', id],
    queryFn: () => questionApi.getById(id),
    select: (data) => data.value,
    enabled: !!id,
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuestionDto) => questionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({
        title: 'Success',
        description: 'Question created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: handleApiError(error),
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuestionDto }) =>
      questionApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({
        title: 'Success',
        description: 'Question updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: handleApiError(error),
        variant: 'destructive',
      });
    },
  });
};
