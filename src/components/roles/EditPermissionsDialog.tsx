
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Permission, Role } from '@/types/role';

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

  const isAdmin = role.name === 'Admin';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Permissions của role: {role.name}</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="mt-4">
          {isAdmin && (
            <p className="text-xs text-muted-foreground mb-2">
              Role <span className="font-semibold">Admin</span> thường nên có full quyền, cẩn thận khi tắt bớt.
            </p>
          )}
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
                    <span className="font-mono text-xs ">{permission}</span>
                  </label>
                );
              })}
              {allPermissions.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Chưa có permission nào. Bạn nên kiểm tra lại dữ liệu từ API /roles.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
