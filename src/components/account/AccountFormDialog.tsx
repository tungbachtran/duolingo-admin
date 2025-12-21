import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

import { useRoleOptions } from '@/hooks/useRoles';
import { type Account } from '@/types/account';
import { useCreateAccount, useUpdateAccount } from '@/hooks/useAccounts';
import { uploadImageAndGetUrl } from '@/api/upload.api';

interface AccountFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  account?: Account | null;
}

export const AccountFormDialog: React.FC<AccountFormDialogProps> = ({
  open,
  onOpenChange,
  mode,
  account,
}) => {
  const { data: roleOptions } = useRoleOptions();

  const [email, setEmail] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [avatarImage, setAvatarImage] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [roleId, setRoleId] = React.useState<string>('');
  const [thumbnailFile, setThumbnailFile] = React.useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = React.useState<string>('');

  React.useEffect(() => {

    setThumbnailPreview(account?.avatarImage || '');
    setThumbnailFile(null);
  }, [account]);

  React.useEffect(() => {
    return () => {
      // cleanup objectURL nếu có
      if (thumbnailPreview?.startsWith('blob:')) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);
  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();

  const isEdit = mode === 'edit';

  React.useEffect(() => {
    if (open) {
      if (isEdit && account) {
        setEmail(account.email || '');
        setFullName(account.fullName || '');
        setAvatarImage(account.avatarImage || '');
        setRoleId(account.roleId?._id || '');
        setPassword('');
      } else {
        setEmail('');
        setFullName('');
        setAvatarImage('');
        setRoleId('');
        setPassword('');
      }
    }
  }, [open, isEdit, account]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async () => {
    if (!email.trim() || !fullName.trim() || !roleId) return;

    if (isEdit && account) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        email: email.trim(),
        fullName: fullName.trim(),
        roleId,
        avatarImage: avatarImage.trim() || undefined,
      };
      if (password.trim()) {
        payload.password = password.trim();
      }

      await updateMutation.mutateAsync({
        id: account._id,
        data: payload,
      });
    } else {
      if (!password.trim()) return;
      let url = ''
      if (thumbnailFile) {
        url = await uploadImageAndGetUrl(thumbnailFile);
      }
      await createMutation.mutateAsync({
        email: email.trim(),
        fullName: fullName.trim(),
        roleId,
        password: password.trim(),
        avatarImage: url || undefined,
      });
    }

    onOpenChange(false);
  };

  const title = isEdit ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản mới';

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!isSubmitting) onOpenChange(value);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label>Họ tên</Label>
            <Input
              placeholder="Tên đầy đủ"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label>Avatar</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setThumbnailFile(f);

                if (thumbnailPreview?.startsWith('blob:')) URL.revokeObjectURL(thumbnailPreview);
                setThumbnailPreview(f ? URL.createObjectURL(f) : (account?.avatarImage || ''));
              }}
            />
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="thumbnail preview"
                className="w-full max-w-[280px] rounded border"
              />
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={roleId}
              onValueChange={(value) => setRoleId(value)}
              disabled={isSubmitting || !roleOptions}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions?.map((role) => (
                  <SelectItem key={role._id} value={role._id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              {isEdit ? 'Mật khẩu (để trống nếu không đổi)' : 'Mật khẩu'}
            </Label>
            <Input
              type="password"
              placeholder={isEdit ? 'Để trống nếu không đổi' : 'Nhập mật khẩu'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className='text-black'
            disabled={
              isSubmitting ||
              !email.trim() ||
              !fullName.trim() ||
              !roleId ||
              (!isEdit && !password.trim())
            }
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
