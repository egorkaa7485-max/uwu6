import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import WebApp from '@twa-dev/sdk';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramContextType {
  user: TelegramUser | null;
  initData: string;
  isReady: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  user: null,
  initData: '',
  isReady: false,
});

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [initData, setInitData] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      WebApp.ready();
      WebApp.expand();
      WebApp.enableClosingConfirmation();
      
      if (WebApp.initDataUnsafe?.user) {
        setUser(WebApp.initDataUnsafe.user as TelegramUser);
      }
      
      setInitData(WebApp.initData || '');
      setIsReady(true);
    } catch (error) {
      console.error('Telegram WebApp initialization error:', error);
      setIsReady(true);
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ user, initData, isReady }}>
      {children}
    </TelegramContext.Provider>
  );
}

export const useTelegram = () => useContext(TelegramContext);
