import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner'; // Import từ sonner
import { courseApi } from '../api/course.api';
import { type GetCommonDto } from '../types/api.types';
import { type CreateCourseDto, type UpdateCourseDto } from '../types/course.types';
import { handleApiError } from '../api/client';

export const useCourses = (params: GetCommonDto) => {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: () => courseApi.getAll(params),
    select: (data) => data.value,
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => courseApi.getById(id),
    select: (data) => data.value,
    enabled: !!id,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseDto) => courseApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course created successfully');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      console.error('Create course error:', error);
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseDto }) =>
      courseApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course updated successfully');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      console.error('Update course error:', error);
    },
  });
};
