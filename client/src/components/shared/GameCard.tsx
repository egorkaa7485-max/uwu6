import { motion } from "framer-motion";
import { useLocation } from "wouter";

interface GameCardProps {
  title: string;
  icon?: string;
  gradient: string;
  path: string;
  rotation?: number;
  delay?: number;
}

export function GameCard({ title, icon, gradient, path, rotation = 0, delay = 0 }: GameCardProps) {
  const [, setLocation] = useLocation();

  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
      animate={{ scale: 1, opacity: 1, rotate: rotation }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setLocation(path)}
      className={`w-[140px] h-[160px] rounded-3xl ${gradient} flex flex-col items-center justify-center text-white font-bold text-lg shadow-2xl relative overflow-hidden`}
      data-testid={`card-game-${title.toLowerCase()}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      {icon && (
        <div className="text-4xl mb-2" data-testid={`icon-${title.toLowerCase()}`}>
          {icon}
        </div>
      )}
      <span className="relative z-10" data-testid={`text-game-${title.toLowerCase()}`}>
        {title}
      </span>
    </motion.button>
  );
}
