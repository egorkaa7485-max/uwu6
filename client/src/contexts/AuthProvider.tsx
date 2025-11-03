import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTelegram } from './TelegramProvider';
import { apiRequest } from '@/lib/queryClient';
import type { User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { initData, isReady } = useTelegram();
  const queryClient = useQueryClient();

  const { mutateAsync: loginMutation } = useMutation({
    mutationFn: async () => {
      const response = await apiRequest<{ user: User; token: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ initData }),
      });
      localStorage.setItem('userId', response.token);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  const { data: userData, isLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    enabled: isReady && !!localStorage.getItem('userId'),
  });

  useEffect(() => {
    if (isReady && initData && !localStorage.getItem('userId')) {
      loginMutation();
    }
  }, [isReady, initData]);

  const login = async () => {
    await loginMutation();
  };

  const value: AuthContextType = {
    user: userData?.user || null,
    isLoading,
    isAuthenticated: !!userData?.user,
    login,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
