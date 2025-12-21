import * as React from 'react';
import { useRoles, useUpdateRoleName, useDeleteRole, useUpdateRolesPermissions } from '@/hooks/useRoles';


import { Button } from '@/components/ui/button';
import { RolesTable } from '@/components/roles/RolesTable';
import { CreateRoleDialog } from '@/components/roles/CreateRoleDialog';
import { EditPermissionsDialog } from '@/components/roles/EditPermissionsDialog';
import { Loader2 } from 'lucide-react';
import type { Permission, Role, RoleSetupItem } from '@/types/role';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/user.api';

export const RoleManagementPage: React.FC = () => {
  const { data: rolesData, isLoading, isError } = useRoles();
  const updateRoleNameMutation = useUpdateRoleName();
  const deleteRoleMutation = useDeleteRole();
  const updatePermissionsMutation = useUpdateRolesPermissions();

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editPermissionsOpen, setEditPermissionsOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null);

  // local state để chỉnh sửa permissions trước khi submit toàn bộ
  const [editableRoles, setEditableRoles] = React.useState<Role[]>([]);
  const { data: user } = useQuery({ queryKey: ['userProfile'], queryFn: userApi.getUserProfile, gcTime: 0 })
  React.useEffect(() => {
    if (rolesData) {
      setEditableRoles(rolesData);
    }
  }, [rolesData]);

  const handleChangeRoleName = (id: string, name: string) => {
    // Gửi patch
    updateRoleNameMutation.mutate({ id, data: { name } });
  };


  const handleDeleteRole = (id: string) => {
    deleteRoleMutation.mutate(id);
  };

  const handleOpenEditPermissions = (role: Role) => {
    const current = editableRoles.find((r) => r._id === role._id) ?? role;
    setSelectedRole(current);
    setEditPermissionsOpen(true);
  };

  const handleChangePermissions = (roleId: string, permissions: Permission[]) => {
    setEditableRoles((prev) =>
      prev.map((r) =>
        r._id === roleId
          ? {
            ...r,
            permissions,
          }
          : r
      )
    );

    // cập nhật selectedRole nếu đang mở
    setSelectedRole((prev) =>
      prev && prev._id === roleId
        ? {
          ...prev,
          permissions,
        }
        : prev
    );
  };

  const allPermissions: Permission[] = React.useMemo(() => {
    const set = new Set<Permission>();

    (rolesData ?? []).forEach((role) => {
      (role.permissions ?? []).forEach((p) => set.add(p));
    });

    return Array.from(set).sort();
  }, [rolesData]);


  const handleSaveAllPermissions = () => {
    const payload: RoleSetupItem[] = editableRoles.map((role) => ({
      id: role._id,
      permissions: role.permissions ?? [],
    }));

    updatePermissionsMutation.mutate(payload);
  };

  const isSavingPermissions = updatePermissionsMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Role management</h1>

        </div>
        <div className="flex items-center gap-2">
          {user?.roleId.permissions.includes('role.setup') && (
            <Button
              variant="outline"
              className='text-black rounde-sm'
              onClick={handleSaveAllPermissions}
              disabled={isSavingPermissions || editableRoles.length === 0}
            >
              {isSavingPermissions && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save all permissions
            </Button>
          )}
          {user?.roleId.permissions.includes('role.create') && (<Button className='text-black rounde-sm' onClick={() => setCreateDialogOpen(true)}>Add a new role</Button>)}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading roles...
        </div>
      )}

      {isError && (
        <div className="text-sm text-red-500">
          Cannot get roles
        </div>
      )}

      {!isLoading && !isError && (
        <RolesTable
          roles={editableRoles}
          onChangeRoleName={handleChangeRoleName}
          onDeleteRole={handleDeleteRole}
          onOpenEditPermissions={handleOpenEditPermissions}
          user={user}
        />
      )}

      {/* Dialog tạo role */}
      <CreateRoleDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

      {/* Dialog edit permissions */}
      <EditPermissionsDialog
        open={editPermissionsOpen}
        onOpenChange={setEditPermissionsOpen}
        role={selectedRole}
        allPermissions={allPermissions}
        onChangePermissions={handleChangePermissions}
      />
    </div>
  );
};
