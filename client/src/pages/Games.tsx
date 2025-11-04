import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useBalance } from "@/hooks/useUser";
import { toast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { TrendingUp, Coins } from "lucide-react";

export default function Games() {
  const [, setLocation] = useLocation();
  const { data: balance } = useBalance();

  const games = [
    {
      id: "upgrade",
      title: "Апгрейд",
      description: "Улучшай предметы",
      icon: "⬆️",
      path: "/games/upgrade",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      id: "coinflip",
      title: "PvP Монетка",
      description: "Играй против других",
      icon: "🪙",
      path: "/games/coinflip",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <Header title="Игры" />
      
      <div className="p-4 max-w-md mx-auto space-y-4">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="bg-zinc-900 border-zinc-800 p-6 cursor-pointer hover:border-lime-500 transition-colors"
              onClick={() => {
                const current = parseFloat(balance || "0");
                if (!current || current <= 0) {
                  toast.warning("Недостаточно средств. Пополните баланс в кошельке.");
                  setLocation("/wallet");
                  return;
                }
                setLocation(game.path);
              }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${game.gradient} flex items-center justify-center text-3xl`}>
                  {game.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{game.title}</h3>
                  <p className="text-zinc-400 text-sm">{game.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
