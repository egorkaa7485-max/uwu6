import { ReactNode, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Gamepad2, User, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
  showTabBar?: boolean;
  showHeader?: boolean;
}

export function Layout({ children, showTabBar = true, showHeader = true }: LayoutProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/cases', label: 'Кейсы', icon: Home, testId: 'nav-cases' },
    { path: '/games', label: 'Игры', icon: Gamepad2, testId: 'nav-games' },
    { path: '/wallet', label: 'Кошелек', icon: Wallet, testId: 'nav-wallet' },
    { path: '/profile', label: 'Профиль', icon: User, testId: 'nav-profile' },
  ];

  return (
    <div className="bg-[#0e0f12] min-h-screen flex flex-col max-w-[600px] mx-auto relative">
      {/* Anti-copy protection (best-effort) */}
      {/** Note: This is client-side only and not a true DRM. */}
      <AntiCopyGuard />
      {/* Header */}
      {showHeader && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0e0f12]/95 backdrop-blur-xl border-b border-gray-800/50 max-w-[600px] mx-auto">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-gray-800/30 rounded-full px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-white text-sm font-semibold" data-testid="online-counter">
                  1,234
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-[#c3ff00]/20 to-[#c3ff00]/10 rounded-full px-4 py-1.5 border border-[#c3ff00]/30">
                <span className="text-[#c3ff00] text-sm font-bold" data-testid="balance-display">
                  {user?.balance || '0'} ⭐
                </span>
              </div>
              
              {user && (
                <Link href="/profile">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c3ff00] to-[#9ed400] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform" data-testid="avatar-button">
                    <User className="w-5 h-5 text-[#0e0f12]" />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${showHeader ? 'pt-14' : ''} ${showTabBar ? 'pb-20' : ''}`}>
        {children}
      </main>

      {/* Tab Bar */}
      {showTabBar && (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#0e0f12]/95 backdrop-blur-xl border-t border-gray-800/50 max-w-[600px] mx-auto">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path || location.startsWith(item.path + '/');
              
              return (
                <Link key={item.path} href={item.path}>
                  <motion.button
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                      isActive 
                        ? 'bg-[#c3ff00]/10' 
                        : 'hover:bg-gray-800/30'
                    }`}
                    whileTap={{ scale: 0.95 }}
                    data-testid={item.testId}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isActive ? 'text-[#c3ff00]' : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={`text-xs font-semibold ${
                        isActive ? 'text-[#c3ff00]' : 'text-gray-400'
                      }`}
                    >
                      {item.label}
                    </span>
                  </motion.button>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

function AntiCopyGuard() {
  useEffect(() => {
    const onContext = (e: MouseEvent) => e.preventDefault();
    const onSelectStart = (e: Event) => e.preventDefault();
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['s','u','c','p','x'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key === 'PrintScreen') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', onContext);
    document.addEventListener('selectstart', onSelectStart as any);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('contextmenu', onContext);
      document.removeEventListener('selectstart', onSelectStart as any);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);
  return null;
}
