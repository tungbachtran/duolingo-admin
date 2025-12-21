
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Permission, Role } from '@/types/role';
import { getPermissionLabel } from './utils';

interface EditPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  allPermissions: Permission[];
  onChangePermissions: (roleId: string, permissions: Permission[]) => void;
}

export const EditPermissionsDialog: React.FC<EditPermissionsDialogProps> = ({
  open,
  onOpenChange,
  role,
  allPermissions,
  onChangePermissions,
}) => {
  if (!role) return null;

  const handleTogglePermission = (permission: Permission) => {
    const hasPermission = role.permissions.includes(permission);
    const nextPermissions = hasPermission
      ? role.permissions.filter((p) => p !== permission)
      : [...role.permissions, permission];

    onChangePermissions(role._id, nextPermissions);
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Permissions of role: {role.name}</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="mt-4">

          <ScrollArea className="h-72 rounded border p-2">
            <div className="space-y-2">
              {allPermissions.map((permission) => {
                const checked = role.permissions.includes(permission);
                return (
                  <label
                    key={permission}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type='checkbox'

                      checked={checked}
                      onChange={() => handleTogglePermission(permission)}
                      className='w-5 h-5'
                    />
                    {getPermissionLabel(permission)}
                  </label>
                );
              })}
              {allPermissions.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Can not get permissons
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
