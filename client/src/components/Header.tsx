import { useBalance } from "@/hooks/useUser";
import { Coins, User as UserIcon } from "lucide-react";
import { useLocation } from "wouter";

export function Header({ title }: { title?: string }) {
  const { data: balance } = useBalance();
  const [, setLocation] = useLocation();

  return (
    <div className="sticky top-0 bg-background/95 backdrop-blur-sm px-4 py-3 z-40">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLocation("/profile")}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center"
            data-testid="button-avatar"
          >
            <UserIcon className="w-5 h-5 text-foreground" />
          </button>
          <div className="text-sm">
            <p className="text-muted-foreground text-xs">Online</p>
            <p className="text-foreground font-semibold">Game Name</p>
          </div>
        </div>
        <button
          onClick={() => setLocation("/wallet")}
          className="flex items-center gap-2 bg-lime/10 hover:bg-lime/20 px-4 py-2 rounded-full transition-colors"
          data-testid="button-balance"
        >
          <Coins className="w-4 h-4 text-lime" />
          <span className="text-lime font-bold text-sm">{balance || "0"} ⭐</span>
        </button>
      </div>
    </div>
  );
}
