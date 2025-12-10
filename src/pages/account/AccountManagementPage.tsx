import * as React from 'react';
import { useAccounts, useDeleteAccount } from '@/hooks/useAccounts';


import { Button } from '@/components/ui/button';

import { Loader2 } from 'lucide-react';
import type { Account } from '@/types/account';
import { AccountsTable } from '@/components/account/AccountsTable';
import { AccountFormDialog } from '@/components/account/AccountFormDialog';

export const AccountManagementPage: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);

  const { data, isLoading, isError, isFetching } = useAccounts(page, pageSize);
  const deleteMutation = useDeleteAccount();

  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<'create' | 'edit'>('create');
  const [selectedAccount, setSelectedAccount] = React.useState<Account | null>(null);

  const accounts = data?.data ?? [];
  const pagination = data?.pagination;

  const handleCreate = () => {
    setSelectedAccount(null);
    setFormMode('create');
    setFormOpen(true);
  };

  const handleEdit = (account: Account) => {
    setSelectedAccount(account);
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const canPrev = pagination ? pagination.page > 1 : false;
  const canNext = pagination ? pagination.page < pagination.totalPages : false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Quản lý tài khoản</h1>
          <p className="text-sm text-muted-foreground">
            Danh sách user, phân quyền, dọn rác những tài khoản tạo xong rồi quên.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isFetching && !isLoading && (
            <span className="flex items-center text-xs text-muted-foreground">
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              Đang cập nhật...
            </span>
          )}
          <Button onClick={handleCreate}>Tạo tài khoản</Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Đang tải danh sách tài khoản...
        </div>
      )}

      {isError && (
        <div className="text-sm text-red-500">
          Lỗi khi tải accounts. Kiểm tra API <code>/api/accounts</code> xem có chạy không.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <AccountsTable data={accounts} onEdit={handleEdit} onDelete={handleDelete} />

          {pagination && (
            <div className="flex items-center justify-between pt-4 text-xs text-muted-foreground">
              <div>
                Trang {pagination.page} / {pagination.totalPages}  
                {' • '}Tổng {pagination.totalRecords} tài khoản
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canPrev}
                  onClick={() => {
                    if (canPrev) setPage((p) => p - 1);
                  }}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canNext}
                  onClick={() => {
                    if (canNext) setPage((p) => p + 1);
                  }}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <AccountFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        account={selectedAccount ?? undefined}
      />
    </div>
  );
};
