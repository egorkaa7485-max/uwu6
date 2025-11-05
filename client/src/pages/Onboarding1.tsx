import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function Onboarding1() {
  const [, setLocation] = useLocation();

  const handleNext = () => {
    setLocation("/onboarding-2");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative w-full min-h-screen h-screen bg-[#0F0F12] overflow-hidden flex flex-col"
    >
      <div className="absolute left-[-137px] top-[56.25%] w-[664px] h-[664px] pointer-events-none z-0 opacity-20">
        <div className="w-full h-full rounded-full bg-[#C4FF00] blur-[250px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
          className="relative w-full max-w-sm mb-auto flex items-center justify-center"
        >
          <div className="relative w-full h-[444px] flex items-center justify-center">
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
              src="/свг/game-welcome.svg"
              alt="Popular games"
              className="w-full max-w-[359px] h-auto drop-shadow-2xl"
              data-testid="img-onboarding-games"
            />
          </div>
        </motion.div>
      </div>

      <div className="relative z-20 px-4 pb-8 sm:pb-12">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <h1 className="text-white text-[24px] sm:text-[28px] font-bold mb-2">
            Popular games
          </h1>
          <p className="text-white/50 text-[14px] sm:text-[15px] mb-6 sm:mb-8">
            All popular games here
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="w-full bg-[#C4FF00] text-black font-semibold py-3.5 sm:py-4 px-6 rounded-[16px] text-[16px] sm:text-[17px] transition-all shadow-lg"
          >
            Next
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
