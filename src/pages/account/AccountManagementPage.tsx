import * as React from 'react';
import { useAccounts, useDeleteAccount } from '@/hooks/useAccounts';


import { Button } from '@/components/ui/button';

import { Loader2 } from 'lucide-react';
import type { Account } from '@/types/account';
import { AccountsTable } from '@/components/account/AccountsTable';
import { AccountFormDialog } from '@/components/account/AccountFormDialog';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/user.api';

export const AccountManagementPage: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);

  const { data, isLoading, isError, isFetching } = useAccounts(page, pageSize);
  const deleteMutation = useDeleteAccount();

  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<'create' | 'edit'>('create');
  const [selectedAccount, setSelectedAccount] = React.useState<Account | null>(null);
  const { data: user } = useQuery({ queryKey: ['userProfile'], queryFn: userApi.getUserProfile, gcTime: 0 })
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
          <h1 className="text-2xl font-semibold tracking-tight">Account management</h1>

        </div>
        <div className="flex items-center gap-2">
          {isFetching && !isLoading && (
            <span className="flex items-center text-xs text-muted-foreground">
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              Updating...
            </span>
          )}
          {user?.roleId.permissions.includes('account.create') && (<Button className='text-black border-2 border-black' onClick={handleCreate}>Create a new account</Button>)}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading account lists...
        </div>
      )}

      {isError && (
        <div className="text-sm text-red-500">
          Cannot get accounts
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <AccountsTable data={accounts} onEdit={handleEdit} onDelete={handleDelete} user = {user} />

          {pagination && (
            <div className="flex items-center justify-between pt-4 text-xs text-muted-foreground">
              <div>
                Page {pagination.page} / {pagination.totalPages}
                {' • '}Total {pagination.totalRecords} accounts
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
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canNext}
                  onClick={() => {
                    if (canNext) setPage((p) => p + 1);
                  }}
                >
                  Next
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
