import { useBalance } from "@/hooks/useUser";
import { Coins } from "lucide-react";

export function Header({ title }: { title?: string }) {
  const { data: balance } = useBalance();

  return (
    <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 px-4 py-3 z-40">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <h1 className="text-xl font-bold text-white">{title || "Case Rush"}</h1>
        <div className="flex items-center gap-2 bg-lime-500/10 px-3 py-1.5 rounded-full">
          <Coins className="w-5 h-5 text-lime-500" />
          <span className="text-lime-500 font-semibold">{balance || "0"}</span>
        </div>
      </div>
    </div>
  );
}
