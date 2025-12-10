import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchRoles,
  createRole,
  updateRolesPermissions,
  updateRoleName,
  deleteRole,
  fetchRoleOptions,
} from "@/api/roles";
import type {
  CreateRoleDto,
  Role,
  RoleOption,
  RoleSetupItem,
  UpdateRoleNameDto,
} from "@/types/role";
import { toast } from "sonner";
import { handleApiError } from "@/api/client";

export const ROLE_KEYS = {
  all: ["roles"] as const,
  list: () => [...ROLE_KEYS.all, "list"] as const,
  options: () => [...ROLE_KEYS.all, "options"] as const,
};

export const useRoles = () => {
  return useQuery<Role[]>({
    queryKey: ROLE_KEYS.list(),
    queryFn: fetchRoles,
  });
};

export const useRoleOptions = () => {
  return useQuery<RoleOption[]>({
    queryKey: ROLE_KEYS.options(),
    queryFn: fetchRoleOptions,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRoleDto) => createRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.options() });
      toast("Role created successfully");
    },
    onError: (error) => {
      toast(handleApiError(error));
    },
  });
};

export const useUpdateRolesPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RoleSetupItem[]) => updateRolesPermissions(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.list() });
      toast("Role permission updated successfully");
    },
    onError: (error) => {
      toast(handleApiError(error));
    },
  });
};

export const useUpdateRoleName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleNameDto }) =>
      updateRoleName(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.options() });
      toast("Role updated successfully");
    },
    onError: (error) => {
      toast(handleApiError(error));
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.options() });
      toast("Role deleted successfully");
    },
    onError: (error) => {
      toast(handleApiError(error));
    },
  });
};
