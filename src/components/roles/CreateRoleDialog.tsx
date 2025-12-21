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
          <DialogTitle>Add a new role</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Role name</label>
            <Input
              placeholder="Example: Student, Moderator..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button className='text-black' onClick={handleSubmit} disabled={!name.trim() || isLoading}>
            {isLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
