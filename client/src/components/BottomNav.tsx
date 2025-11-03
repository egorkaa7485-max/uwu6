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
    <div className="fixed bottom-0 left-0 right-0 bg-card-bg border-t border-border px-4 pb-safe z-50">
      <div className="flex justify-around items-center max-w-md mx-auto py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location === tab.path;
          
          return (
            <button
              key={tab.path}
              onClick={() => setLocation(tab.path)}
              className="relative flex flex-col items-center gap-1 py-2 px-3 min-w-[60px] transition-all"
              data-testid={`nav-${tab.label.toLowerCase()}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-lime/10 rounded-xl"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <Icon 
                className={`w-6 h-6 relative z-10 transition-colors ${
                  isActive ? "text-lime" : "text-foreground/40"
                }`} 
              />
              <span className={`text-[11px] relative z-10 font-medium transition-colors ${
                isActive ? "text-lime" : "text-foreground/40"
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
