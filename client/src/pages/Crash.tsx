import { motion } from "framer-motion";
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { GameHeader } from "@/components/shared/GameHeader";
import { BetPanel } from "@/components/shared/BetPanel";
import { pageTransition } from "@/lib/transitions";

export default function Crash() {
  const [multiplier, setMultiplier] = useState(1.00);
  const [isPlaying, setIsPlaying] = useState(false);
  const [betAmount, setBetAmount] = useState(100);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Start game simulation
      const interval = setInterval(() => {
        setMultiplier((prev) => prev + 0.01);
      }, 100);
      
      setTimeout(() => {
        clearInterval(interval);
        setIsPlaying(false);
        setMultiplier(1.00);
      }, 5000);
    }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative w-full min-h-screen bg-[#0F0F12] flex flex-col"
    >
      <Header />

      <div className="flex-1 flex flex-col px-4 pt-4 pb-24">
        <GameHeader title="Crash" />

        {/* Game Chart */}
        <div className="bg-gradient-to-br from-[#15151A] to-[#0B0B0D] rounded-3xl p-6 mb-4 relative overflow-hidden" data-testid="container-game-chart">
          <div className="absolute inset-0">
            <div className="w-full h-full flex items-end justify-start p-6">
              <div className="w-full h-full flex flex-col justify-end">
                {/* Chart bars */}
                <div className="flex items-end justify-between h-full gap-1">
                  {[86, 73, 91, 91].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-[#18181D] rounded-t flex flex-col justify-end"
                      style={{ height: `${height}%` }}
                      data-testid={`chart-bar-${i}`}
                    >
                      <div className="h-full opacity-5 bg-black"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Multiplier Display */}
          <div className="relative z-10 h-40 flex items-center justify-center">
            <motion.div
              animate={{
                scale: isPlaying ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: isPlaying ? Infinity : 0,
              }}
              className="text-center"
            >
              <div className="text-6xl font-bold text-white mb-2" data-testid="text-multiplier">
                {multiplier.toFixed(2)}x
              </div>
              <div className="text-sm text-white/50" data-testid="text-game-status">
                {isPlaying ? "wait for win" : "00:00"}
              </div>
            </motion.div>
          </div>

          {/* Dots decoration */}
          <div className="absolute top-4 right-4 flex gap-1" data-testid="indicator-dots">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-white/50"></div>
            ))}
          </div>
        </div>

        <BetPanel
          betAmount={betAmount}
          onBetChange={setBetAmount}
          onPlay={handlePlay}
          isPlaying={isPlaying}
          disabled={isPlaying}
        />

        {/* Recent Games */}
        <div className="bg-[#15151A] rounded-3xl p-4 mt-4">
          <h3 className="text-white text-sm font-medium mb-3" data-testid="heading-recent-games">
            Recent Games
          </h3>
          <div className="space-y-2">
            {[
              { multiplier: "2.35x", win: true },
              { multiplier: "1.85x", win: true },
              { multiplier: "0.00x", win: false },
            ].map((game, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                data-testid={`row-game-result-${i}`}
              >
                <span className="text-white/50 text-sm" data-testid={`text-game-number-${i}`}>
                  Game #{i + 1}
                </span>
                <span
                  className={`font-medium ${
                    game.win ? "text-[#C4FF00]" : "text-red-500"
                  }`}
                  data-testid={`text-game-multiplier-${i}`}
                >
                  {game.multiplier}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </motion.div>
  );
}
