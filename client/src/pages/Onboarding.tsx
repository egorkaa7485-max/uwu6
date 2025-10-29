import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Gift, Star, Trophy, Crown, Gem, Sparkles } from "lucide-react";

const onboardingScreens = [
  {
    id: 1,
    type: "welcome" as const,
  },
  {
    id: 2,
    type: "popular-games" as const,
  },
  {
    id: 3,
    type: "leaderboard" as const,
  },
  {
    id: 4,
    type: "wallet-cards" as const,
  },
  {
    id: 5,
    type: "deposit" as const,
  },
];

export const Onboarding = (): JSX.Element => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetOnboarding = urlParams.get('reset');
    
    if (resetOnboarding === 'true') {
      localStorage.removeItem("hasSeenOnboarding");
      window.history.replaceState({}, '', '/');
      return;
    }
    
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (hasSeenOnboarding) {
      setLocation("/main");
    }
  }, [setLocation]);

  const handleNext = () => {
    if (currentScreen < onboardingScreens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      localStorage.setItem("hasSeenOnboarding", "true");
      setLocation("/main");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setLocation("/main");
  };

  const screen = onboardingScreens[currentScreen];

  return (
    <div className="bg-[#0e0f12] w-full min-h-screen flex flex-col max-w-[600px] mx-auto relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col relative"
        >
          {/* Screen 1: Welcome - PLINKO / CRASH / UPGRADE */}
          {screen.type === "welcome" && (
            <div className="flex-1 flex flex-col items-center justify-center px-8 pb-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-full text-center space-y-4"
              >
                <motion.h1 
                  className="font-black text-white text-[64px] leading-tight tracking-tight"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  PLINKO
                </motion.h1>
                <motion.h1 
                  className="font-black text-white text-[64px] leading-tight tracking-tight"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  CRASH
                </motion.h1>
                <motion.h1 
                  className="font-black text-white text-[64px] leading-tight tracking-tight opacity-30"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.3, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  UPGRADE
                </motion.h1>
              </motion.div>
            </div>
          )}

          {/* Screen 2: Popular games */}
          {screen.type === "popular-games" && (
            <div className="flex-1 flex flex-col px-6 pt-16 pb-32">
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="font-bold text-white text-[28px] mb-8"
              >
                Popular games
              </motion.h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((num, index) => (
                  <motion.div
                    key={num}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.08, duration: 0.4 }}
                  >
                    <Card className="bg-gradient-to-r from-[#1c1d21] to-[#18191c] border border-gray-800/30 rounded-2xl shadow-lg">
                      <CardContent className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center shadow-lg flex-shrink-0">
                          <span className="text-black font-black text-lg">{num}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-bold text-lg">Maxim</p>
                          <p className="text-gray-400 text-sm">330 000 points</p>
                        </div>
                        <Trophy className="w-6 h-6 text-[#FFD700] flex-shrink-0" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Screen 3: Leaderboard */}
          {screen.type === "leaderboard" && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-full space-y-8"
              >
                <h2 className="font-black text-white text-[48px] text-center mb-12">
                  Leaderboard
                </h2>
                
                <div className="space-y-5">
                  {/* GOLD MEMBER */}
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-gradient-to-r from-[#FFD700]/10 via-[#FFA500]/10 to-[#FFD700]/10 border-2 border-[#FFD700] rounded-3xl p-6 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Crown className="w-7 h-7 text-[#FFD700]" />
                      <span className="font-black text-[22px] text-[#FFD700] tracking-wider">
                        GOLD MEMBER
                      </span>
                    </div>
                  </motion.div>

                  {/* DIAMOND MEMBER */}
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-gradient-to-r from-[#00BFFF]/10 via-[#1E90FF]/10 to-[#00BFFF]/10 border-2 border-[#00BFFF] rounded-3xl p-6 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Gem className="w-7 h-7 text-[#00BFFF]" />
                      <span className="font-black text-[22px] text-[#00BFFF] tracking-wider">
                        DIAMOND MEMBER
                      </span>
                    </div>
                  </motion.div>

                  {/* BRILLIANCE MEMBER */}
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="bg-gradient-to-r from-[#c3ff00]/10 via-[#a0d600]/10 to-[#c3ff00]/10 border-2 border-[#c3ff00] rounded-3xl p-6 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Sparkles className="w-7 h-7 text-[#c3ff00]" />
                      <span className="font-black text-[22px] text-[#c3ff00] tracking-wider">
                        BRILLIANCE MEMBER
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Screen 4: Wallet cards */}
          {screen.type === "wallet-cards" && (
            <div className="flex-1 flex flex-col px-6 pt-16 pb-32">
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="font-bold text-white text-[28px] mb-8"
              >
                Wallet cards
              </motion.h2>
              <div className="grid grid-cols-2 gap-4">
                {/* TON Card */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                  className="col-span-1"
                >
                  <Card 
                    className="border-0 rounded-3xl aspect-square overflow-hidden shadow-2xl"
                    style={{
                      background: "linear-gradient(135deg, #0088CC 0%, #005580 100%)",
                    }}
                  >
                    <CardContent className="p-0 flex flex-col items-center justify-center h-full gap-3">
                      <Coins className="w-14 h-14 text-white" strokeWidth={2} />
                      <p className="text-white font-bold text-lg">TON</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Gifts Card */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.5, type: "spring" }}
                  className="col-span-1"
                >
                  <Card 
                    className="border-0 rounded-3xl aspect-square overflow-hidden shadow-2xl"
                    style={{
                      background: "linear-gradient(135deg, #FF6B6B 0%, #C92A2A 100%)",
                    }}
                  >
                    <CardContent className="p-0 flex flex-col items-center justify-center h-full gap-3">
                      <Gift className="w-14 h-14 text-white" strokeWidth={2} />
                      <p className="text-white font-bold text-lg">Gifts</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Stars Card */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                  className="col-span-2"
                >
                  <Card 
                    className="border-0 rounded-3xl overflow-hidden shadow-2xl"
                    style={{
                      background: "linear-gradient(135deg, #FFD93D 0%, #F0B429 100%)",
                      aspectRatio: "2/1"
                    }}
                  >
                    <CardContent className="p-0 flex flex-col items-center justify-center h-full gap-3">
                      <Star className="w-14 h-14 text-white" strokeWidth={2} fill="white" />
                      <p className="text-white font-bold text-lg">Stars</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          )}

          {/* Screen 5: Deposit */}
          {screen.type === "deposit" && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-center space-y-10"
              >
                <h2 className="font-black text-white text-[40px] leading-tight px-4">
                  Deposit in any methods
                </h2>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Button 
                    className="h-16 px-14 bg-[#c3ff00] hover:bg-[#b3ef00] rounded-full shadow-2xl"
                    data-testid="button-connect-wallet"
                  >
                    <span className="font-black text-[#0e0f12] text-lg">
                      Connect Wallet
                    </span>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="fixed bottom-0 left-0 right-0 bg-[#0e0f12]/95 backdrop-blur-xl border-t border-gray-800/50 p-6 max-w-[600px] mx-auto"
      >
        {/* Progress Indicators */}
        <div className="flex gap-2 mb-5 justify-center">
          {onboardingScreens.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentScreen ? "bg-[#c3ff00] w-10" : "bg-gray-700 w-2"
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleSkip}
            variant="outline"
            className="flex-1 h-14 bg-transparent border-2 border-gray-700 text-white hover:bg-white/5 rounded-full"
            data-testid="button-skip-onboarding"
          >
            <span className="font-semibold text-base">Skip</span>
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 h-14 bg-[#c3ff00] hover:bg-[#b3ef00] rounded-full shadow-lg"
            data-testid="button-next-onboarding"
          >
            <span className="font-black text-[#0e0f12] text-base">
              {currentScreen === onboardingScreens.length - 1 ? "Get Started" : "Next"}
            </span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
