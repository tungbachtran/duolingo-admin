import type { CreateRoleDto, Role, RoleOption, RoleOptionsResponse, RoleSetupItem, RolesResponse, UpdateRoleNameDto } from '@/types/role';

import { apiClient } from './client';




// GET /api/roles
export const fetchRoles = async (): Promise<Role[]> => {
  const res = await apiClient.get<RolesResponse>('/roles');
  return res.data.value;
};

// POST /api/roles
export const createRole = async (payload: CreateRoleDto): Promise<Role> => {
  const res = await apiClient.post<Role>('/roles', payload);
  return res.data;
};

// GET /api/roles/options
export const fetchRoleOptions = async (): Promise<RoleOption[]> => {
  const res = await apiClient.get<RoleOptionsResponse>('/roles/options');
  return res.data.value;
};

// PUT /api/roles/setup
export const updateRolesPermissions = async (
  payload: RoleSetupItem[]
): Promise<void> => {
  await apiClient.put('/roles/setup', payload);
};

// PATCH /api/roles/:id
export const updateRoleName = async (id: string, payload: UpdateRoleNameDto): Promise<Role> => {
  const res = await apiClient.patch<Role>(`/roles/${id}`, payload);
  return res.data;
};

// DELETE /api/roles/:id
export const deleteRole = async (id: string): Promise<void> => {
  await apiClient.delete(`/roles/${id}`);
};
