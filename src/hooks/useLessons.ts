import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonApi, type CreateLessonDto, type UpdateLessonDto } from '../api/lesson.api';

import { toast } from './use-toast';
import { handleApiError } from '../api/client';

export const useLessons = (unitId:string) => {


  return useQuery({
    queryKey: ['lessons', unitId],
    queryFn: () => lessonApi.getAll(unitId),
    select: (data) => data.value,
  });
};

export const useLesson = (id: string) => {
  return useQuery({
    queryKey: ['lesson', id],
    queryFn: () => lessonApi.getById(id),
    select: (data) => data.value,
    enabled: !!id,
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLessonDto) => lessonApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast({
        title: 'Success',
        description: 'Lesson created successfully',
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

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLessonDto }) =>
      lessonApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast({
        title: 'Success',
        description: 'Lesson updated successfully',
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
