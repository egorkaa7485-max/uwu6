import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userAPI, authAPI } from "@/lib/api";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await authAPI.login();
      return response.data.user;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useBalance() {
  return useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      const response = await userAPI.getBalance();
      return response.data.balance;
    },
    refetchInterval: 3000,
  });
}

export function useDeposit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (amount: number) => userAPI.deposit(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["balance"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await userAPI.getTransactions();
      return response.data.transactions;
    },
  });
}

export function useInventory() {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const response = await userAPI.getInventory();
      return response.data.inventory;
    },
  });
}
