import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { theoryApi } from "../api/theory.api";

import {
  type CreateTheoryDto,
  type UpdateTheoryDto,
} from "../types/theory.types";

import { handleApiError } from "../api/client";
import { toast } from "sonner";

export const useTheories = (unitId: string) => {
  return useQuery({
    queryKey: ["theories", unitId],
    queryFn: () => theoryApi.getAll(unitId),
    select: (data) => data.value,
  });
};

export const useTheory = (id: string) => {
  return useQuery({
    queryKey: ["theory", id],
    queryFn: () => theoryApi.getById(id),
    select: (data) => data.value,
    enabled: !!id,
  });
};

export const useCreateTheory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTheoryDto) => theoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theories"] });
      toast("Theory created successfully");
    },
    onError: (error) => {
      toast(handleApiError(error));
    },
  });
};

export const useUpdateTheory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTheoryDto }) =>
      theoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theories"] });
      toast("Theory updated successfully");
    },
    onError: (error) => {
      toast(handleApiError(error));
    },
  });
};

export const useDeleteTheory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => theoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theories"] });
      toast("Theory deleted successfully");
    },
    onError: (error) => {
      toast(handleApiError(error));
    },
  });
};
