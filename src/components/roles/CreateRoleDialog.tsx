import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateRole } from '@/hooks/useRoles';

interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateRoleDialog: React.FC<CreateRoleDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [name, setName] = useState('');
  const createRoleMutation = useCreateRole();

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await createRoleMutation.mutateAsync({ name: name.trim() });
    setName('');
    onOpenChange(false);
  };

  const isLoading = createRoleMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(value) => { 
      if (!isLoading) onOpenChange(value);
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm role mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên role</label>
            <Input
              placeholder="Ví dụ: Student, Moderator..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || isLoading}>
            {isLoading ? 'Đang tạo...' : 'Tạo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
