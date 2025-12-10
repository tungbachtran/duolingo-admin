import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  Account,
  CreateAccountDto,
  UpdateAccountDto,
  AccountsPagination,
} from "@/types/account";
import {
  createAccount,
  deleteAccount,
  fetchAccountById,
  fetchAccounts,
  updateAccount,
} from "@/api/account.api";
import { toast } from "sonner";
import { handleApiError } from "@/api/client";

export const ACCOUNT_KEYS = {
  all: ["accounts"] as const,
  list: (page: number, pageSize: number) =>
    [...ACCOUNT_KEYS.all, "list", { page, pageSize }] as const,
  detail: (id: string) => [...ACCOUNT_KEYS.all, "detail", id] as const,
};

export const useAccounts = (page: number, pageSize: number) => {
  return useQuery<{ data: Account[]; pagination: AccountsPagination }>({
    queryKey: ACCOUNT_KEYS.list(page, pageSize),
    queryFn: () => fetchAccounts({ page, pageSize }),
  });
};

export const useAccountDetail = (id: string | null) => {
  return useQuery<Account>({
    queryKey: id ? ACCOUNT_KEYS.detail(id) : ["accounts", "detail", "disabled"],
    queryFn: () => {
      if (!id) {
        throw new Error("No id");
      }
      return fetchAccountById(id);
    },
    enabled: !!id,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAccountDto) => createAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_KEYS.all });
      toast("Account created successfully");
    },
    onError: (error) => {
      toast(handleApiError(error));
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountDto }) =>
      updateAccount(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: ACCOUNT_KEYS.detail(variables.id),
      });
      toast("Account updated successfully");
    },
    onError: (error) => {
      toast(handleApiError(error));
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_KEYS.all });
      toast("Account deleted successfully");
    },
    onError: (error) => {
      toast(handleApiError(error));
    },
  });
};
