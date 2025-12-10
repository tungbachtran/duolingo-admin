import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  lessonApi,
  type CreateLessonDto,
  type UpdateLessonDto,
} from "../api/lesson.api";

import { handleApiError } from "../api/client";
import { toast } from "sonner";

export const useLessons = (unitId: string) => {
  return useQuery({
    queryKey: ["lessons", unitId],
    queryFn: () => lessonApi.getAll(unitId),
    select: (data) => data.value,
  });
};

export const useLesson = (id: string) => {
  return useQuery({
    queryKey: ["lesson", id],
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
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["units"] });
      toast("Lesson created successfully");
    },
    onError: (error) => {
      toast(handleApiError(error));
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLessonDto }) =>
      lessonApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["units"] });
      toast("Lesson updated successfully");
    },
    onError: (error) => {
      toast(handleApiError(error));
    },
  });
};
