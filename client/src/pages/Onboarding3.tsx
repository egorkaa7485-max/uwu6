import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function Onboarding3() {
  const [, setLocation] = useLocation();

  const handleNext = () => {
    setLocation("/onboarding-4");
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
          <div className="relative flex flex-col items-center justify-center h-[380px]">
            <motion.img
              initial={{ x: -40, rotate: -8, opacity: 0 }}
              animate={{ x: -20, rotate: -7.1, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
              src="/свг/Group 38.svg"
              alt="Gold Member"
              className="w-[200px] sm:w-[216px] h-auto relative z-30 drop-shadow-2xl mb-3"
            />
            <motion.img
              initial={{ x: 60, y: -20, rotate: 10, opacity: 0 }}
              animate={{ x: 70, y: -60, rotate: 14.8, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
              src="/свг/Group 39.svg"
              alt="Diamond Member"
              className="w-[250px] sm:w-[272px] h-auto absolute right-[-10px] top-[40px] z-20 drop-shadow-2xl"
            />
            <motion.img
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
              src="/свг/Group 40.svg"
              alt="Brilliance Member"
              className="w-[290px] sm:w-[318px] h-auto relative z-10 drop-shadow-2xl"
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
            Wallet cards
          </h1>
          <p className="text-white/50 text-[14px] sm:text-[15px] mb-6 sm:mb-8">
            Do deposits and upgrade you cards
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
