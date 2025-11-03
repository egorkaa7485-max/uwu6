import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function Onboarding2() {
  const [, setLocation] = useLocation();

  const handleNext = () => {
    setLocation("/onboarding-3");
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
          className="relative w-full max-w-sm mb-auto"
        >
          <div className="relative flex items-center justify-center h-[320px]">
            <motion.img
              initial={{ x: -50, rotate: -10, opacity: 0 }}
              animate={{ x: -60, rotate: -6.8, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
              src="/свг/Group 61.svg"
              alt="TON"
              className="absolute left-[-10px] top-[50px] w-[150px] sm:w-[164px] h-auto z-30 drop-shadow-2xl"
            />
            <motion.img
              initial={{ y: -30, rotate: 5, opacity: 0 }}
              animate={{ y: -30, rotate: 4.16, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
              src="/свг/Group 62.svg"
              alt="Stars"
              className="absolute left-[100px] top-0 w-[145px] sm:w-[155px] h-auto z-20 drop-shadow-2xl"
            />
            <motion.img
              initial={{ x: 50, rotate: 15, opacity: 0 }}
              animate={{ x: 50, rotate: 12.8, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
              src="/свг/Group 63.svg"
              alt="Gifts"
              className="absolute right-[-10px] top-[30px] w-[175px] sm:w-[187px] h-auto z-10 drop-shadow-2xl"
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
            Deposit in any methods
          </h1>
          <p className="text-white/50 text-[14px] sm:text-[15px] mb-6 sm:mb-8">
            All methods here
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
