import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { gamesAPI } from "@/lib/api";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { hapticFeedback } from "@/lib/telegram";

export default function Coinflip() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [betAmount, setBetAmount] = useState("100");
  const [selectedSide, setSelectedSide] = useState<"heads" | "tails">("heads");
  const [showResult, setShowResult] = useState<any>(null);

  const { data: games, refetch } = useQuery({
    queryKey: ["coinflip-games"],
    queryFn: async () => {
      const response = await gamesAPI.coinflip.getActive();
      return response.data.games;
    },
    refetchInterval: 3000,
  });

  const createGame = useMutation({
    mutationFn: () => gamesAPI.coinflip.create(parseFloat(betAmount), selectedSide),
    onSuccess: () => {
      hapticFeedback("success");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["balance"] });
    },
  });

  const joinGame = useMutation({
    mutationFn: (gameId: string) => gamesAPI.coinflip.join(gameId),
    onSuccess: (response) => {
      setShowResult(response.data);
      hapticFeedback("success");
      setTimeout(() => setShowResult(null), 3000);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["balance"] });
    },
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header title="PvP Монетка" />
      
      <div className="p-4 max-w-md mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/games")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>

        <Card className="bg-zinc-900 border-zinc-800 p-4 mb-4">
          <h3 className="font-semibold mb-3">Создать игру</h3>
          <Input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            placeholder="Ставка"
            className="mb-3 bg-zinc-800 border-zinc-700"
          />
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setSelectedSide("heads")}
              className={`flex-1 p-4 rounded-lg border text-2xl ${
                selectedSide === "heads" 
                  ? "border-lime-500 bg-lime-500/10" 
                  : "border-zinc-700 bg-zinc-800"
              }`}
            >
              🐸 Орел
            </button>
            <button
              onClick={() => setSelectedSide("tails")}
              className={`flex-1 p-4 rounded-lg border text-2xl ${
                selectedSide === "tails" 
                  ? "border-blue-500 bg-blue-500/10" 
                  : "border-zinc-700 bg-zinc-800"
              }`}
            >
              🎯 Решка
            </button>
          </div>
          <Button
            onClick={() => createGame.mutate()}
            disabled={createGame.isPending}
            className="w-full bg-lime-500 hover:bg-lime-600 text-black font-bold"
          >
            Создать игру
          </Button>
        </Card>

        <h3 className="font-semibold mb-3">Активные игры</h3>
        <div className="space-y-2">
          {games?.length === 0 && (
            <p className="text-center text-zinc-400 py-8">Нет активных игр</p>
          )}
          {games?.map((game: any) => (
            <Card key={game.id} className="bg-zinc-900 border-zinc-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{game.betAmount} ⭐</div>
                  <div className="text-sm text-zinc-400">
                    Сторона: {game.creatorSide === "heads" ? "🐸 Орел" : "🎯 Решка"}
                  </div>
                </div>
                <Button
                  onClick={() => joinGame.mutate(game.id)}
                  disabled={joinGame.isPending}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Играть
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            >
              <Card className="bg-zinc-900 border-lime-500 p-6 text-center">
                <motion.div
                  animate={{ rotateY: [0, 180, 360] }}
                  transition={{ duration: 1, repeat: 1 }}
                  className="text-6xl mb-4"
                >
                  🪙
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">
                  Результат: {showResult.result === "heads" ? "🐸 Орел" : "🎯 Решка"}
                </h3>
                <p className="text-xl text-lime-500">
                  {showResult.winnerId ? "Победа!" : "Проигрыш"}
                </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
