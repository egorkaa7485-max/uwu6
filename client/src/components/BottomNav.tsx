import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Package, Gamepad2, Wallet, User } from "lucide-react";

export function BottomNav() {
  const [location, setLocation] = useLocation();

  const tabs = [
    { path: "/cases", icon: Package, label: "Кейсы" },
    { path: "/games", icon: Gamepad2, label: "Игры" },
    { path: "/wallet", icon: Wallet, label: "Кошелёк" },
    { path: "/profile", icon: User, label: "Профиль" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location === tab.path;
          
          return (
            <button
              key={tab.path}
              onClick={() => setLocation(tab.path)}
              className="relative flex flex-col items-center gap-1 py-2 px-4 min-w-[60px]"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-lime-500/10 rounded-xl"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <Icon 
                className={`w-6 h-6 relative z-10 ${
                  isActive ? "text-lime-500" : "text-zinc-400"
                }`} 
              />
              <span className={`text-xs relative z-10 ${
                isActive ? "text-lime-500 font-medium" : "text-zinc-400"
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
