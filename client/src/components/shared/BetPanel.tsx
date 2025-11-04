import { motion } from "framer-motion";
import { slideUp } from "@/lib/transitions";

interface BetPanelProps {
  betAmount: number;
  currency?: string;
  onBetChange?: (amount: number) => void;
  onPlay?: () => void;
  isPlaying?: boolean;
  playButtonText?: string;
  disabled?: boolean;
}

export function BetPanel({
  betAmount = 100,
  currency = "USDT",
  onBetChange,
  onPlay,
  isPlaying = false,
  playButtonText,
  disabled = false,
}: BetPanelProps) {
  const handleIncrease = () => {
    if (onBetChange) onBetChange(betAmount + 10);
  };

  const handleDecrease = () => {
    if (onBetChange && betAmount > 10) onBetChange(betAmount - 10);
  };

  return (
    <motion.div
      variants={slideUp}
      className="bg-[#15151A] rounded-3xl p-4"
      data-testid="container-bet-panel"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1">
          <div className="text-white/50 text-xs mb-1" data-testid="label-bet-amount">
            Bet Amount
          </div>
          <div className="bg-[#0F0F12] rounded-xl px-4 py-2.5 flex items-center justify-between">
            <span className="text-white font-medium" data-testid="text-bet-value">
              {betAmount.toFixed(2)}
            </span>
            <span className="text-[#C4FF00] text-sm" data-testid="text-currency">
              {currency}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <button
            onClick={handleIncrease}
            disabled={disabled}
            className="w-10 h-10 bg-[#0F0F12] rounded-xl flex items-center justify-center text-white disabled:opacity-50"
            data-testid="button-increase-bet"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="rotate-180">
              <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={handleDecrease}
            disabled={disabled}
            className="w-10 h-10 bg-[#0F0F12] rounded-xl flex items-center justify-center text-white disabled:opacity-50"
            data-testid="button-decrease-bet"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onPlay}
        disabled={disabled}
        className="w-full bg-[#C4FF00] text-black font-semibold py-3.5 rounded-2xl text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="button-play-game"
      >
        {playButtonText || (isPlaying ? "Cash Out" : "Play")}
      </motion.button>
    </motion.div>
  );
}
