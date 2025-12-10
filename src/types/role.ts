export type Permission = string;

export interface Role {
  _id: string;
  name: string;
  permissions: Permission[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface RoleOption {
  _id: string;
  name: string;
}

export interface RolesResponse {
  value: Role[];
}

export interface RoleOptionsResponse {
  value: RoleOption[];
}

export interface CreateRoleDto {
  name: string;
}

export interface UpdateRoleNameDto {
  name: string;
}

export interface RoleSetupItem {
  id: string;
  permissions: Permission[];
}
