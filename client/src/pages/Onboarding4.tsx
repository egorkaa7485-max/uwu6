import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function Onboarding4() {
  const [, setLocation] = useLocation();

  const handleNext = () => {
    setLocation("/main");
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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md mb-auto"
        >
          <div className="relative w-full flex justify-center items-center">
            <img
              src="/свг/Group 56.svg"
              alt="Group 56"
              className="w-24 h-24 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2"
            />
            <img
              src="/свг/Group 56 (1).svg"
              alt="Group 56 (1)"
              className="w-24 h-24 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2"
            />
            <img
              src="/свг/Group 56 (2).svg"
              alt="Group 56 (2)"
              className="w-24 h-24 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2"
            />
            <img
              src="/свг/Group 64.svg"
              alt="Group 64"
              className="w-32 h-32 relative z-10"
            />
          </div>
        </motion.div>
      </div>

      <div className="relative z-20 px-4 pb-8 sm:pb-12">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <h1 className="text-white text-[24px] sm:text-[28px] font-bold mb-2">
            Leaderboard
          </h1>
          <p className="text-white/50 text-[14px] sm:text-[15px] mb-6 sm:mb-8">
            Earn reward for top positions
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
