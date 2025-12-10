import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchRoles,
  createRole,
  updateRolesPermissions,
  updateRoleName,
  deleteRole,
  fetchRoleOptions,
} from '@/api/roles';
import type {
  CreateRoleDto,
  Role,
  RoleOption,
  RoleSetupItem,
  UpdateRoleNameDto,
} from '@/types/role';

export const ROLE_KEYS = {
  all: ['roles'] as const,
  list: () => [...ROLE_KEYS.all, 'list'] as const,
  options: () => [...ROLE_KEYS.all, 'options'] as const,
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
    },
  });
};

export const useUpdateRolesPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RoleSetupItem[]) => updateRolesPermissions(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.list() });
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
    },
  });
};
