import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unitApi, type CreateUnitDto, type UpdateUnitDto } from '../api/unit.api';
import { toast } from 'sonner';
import { handleApiError } from '../api/client';

export const useUnits = (courseId:string) => {
 

  return useQuery({
    queryKey: ['units', courseId],
    queryFn: () => unitApi.getAll(courseId),
    select: (data) => data.value,
  });
};

export const useCourseUnits = (id:string) => {
  
  return useQuery({
    queryKey: ['courseUnits', id],
    queryFn: () => unitApi.getAll(id),
    select: (data) => data.value,
    enabled: !!id,
  });
};

export const useUnit = (id: string) => {
  return useQuery({
    queryKey: ['unit', id],
    queryFn: () => unitApi.getById(id),
    select: (data) => data.value,
    enabled: !!id,
  });
};

export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUnitDto) => unitApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseUnits'] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast('Unit created successfully');
    },
    onError: (error) => {
      toast(handleApiError(error));
    },
  });
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUnitDto }) =>
      unitApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['courseUnits'] });
      toast('Unit updated successfully');
    },
    onError: (error) => {
      toast(handleApiError(error));
    },
  });
};
