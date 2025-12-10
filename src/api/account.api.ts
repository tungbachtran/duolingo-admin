import type { Account, AccountsListResponse, AccountsPagination, CreateAccountDto, UpdateAccountDto } from '@/types/account';
import { apiClient } from './client';


// GET /api/accounts?pageSize=&page=
export const fetchAccounts = async (params: {
  page: number;
  pageSize: number;
}): Promise<{ data: Account[]; pagination: AccountsPagination }> => {
  const res = await apiClient.get<AccountsListResponse>('/accounts', {
    params,
  });

  return {
    data: res.data.value.data,
    pagination: res.data.value.pagination,
  };
};

// GET /api/accounts/:id
export const fetchAccountById = async (id: string): Promise<Account> => {
  const res = await apiClient.get<Account>(`/accounts/${id}`);
  return res.data;
};

// POST /api/accounts
export const createAccount = async (payload: CreateAccountDto): Promise<Account> => {
  const res = await apiClient.post<Account>('/accounts', payload);
  return res.data;
};

// PATCH /api/accounts/:id
export const updateAccount = async (id: string, payload: UpdateAccountDto): Promise<Account> => {
  const res = await apiClient.patch<Account>(`/accounts/${id}`, payload);
  return res.data;
};

// DELETE /api/accounts/:id
export const deleteAccount = async (id: string): Promise<void> => {
  await apiClient.delete(`/accounts/${id}`);
};
