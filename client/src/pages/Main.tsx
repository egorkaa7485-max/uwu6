import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import gameCardsImg from "/figmaAssets/game-cards.png";

const bannerSlides = [
  {
    title: "Open cases and",
    highlight: "win $10 000",
    bgImage: "/figmaAssets/mask-group-3.png",
  },
  {
    title: "Popular games",
    highlight: "Big rewards",
    bgImage: "/figmaAssets/mask-group-4.png",
  },
  {
    title: "Join now and",
    highlight: "get bonus",
    bgImage: "/figmaAssets/mask-group-5.png",
  },
];

const gameCards = [
  {
    title: "CRASH",
    position: { top: 0, left: 0 },
  },
  {
    title: "UPGRADE",
    position: { top: 0, left: "50%" },
  },
  {
    title: "COINFLIP",
    position: { top: "50%", left: 0 },
  },
  {
    title: "PLINKO",
    position: { top: "50%", left: "50%" },
  },
];

export const Main = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 30000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const paginate = (newDirection: number) => {
    const newSlide = (currentSlide + newDirection + bannerSlides.length) % bannerSlides.length;
    setCurrentSlide(newSlide);
    setPage([newSlide, newDirection]);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (_: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  const handleProfileClick = () => {
    setLocation("/profile");
  };

  return (
    <div className="main bg-background w-full min-h-screen flex flex-col max-w-[600px] mx-auto">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-4 py-4"
      >
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleProfileClick}
            data-testid="button-profile"
            className="flex w-9 h-9 items-center justify-center transition-all duration-300"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-avatar-from to-avatar-to flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
              <span className="text-foreground text-sm font-bold">M</span>
            </div>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Button 
            className="h-9 px-2.5 bg-lime hover:bg-lime/90 rounded-3xl transition-all duration-300 hover:scale-105"
            data-testid="button-connect-wallet-main"
          >
            <span className="[font-family:'Inter',Helvetica] font-bold text-primary-foreground text-xs tracking-[-0.24px]">
              {t("main.connectWallet")}
            </span>
          </Button>
        </motion.div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="main-banner px-4 mb-6 relative"
      >
        <div className="relative w-full h-[145px] rounded-3xl overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={{
                enter: (direction: number) => ({
                  x: direction > 0 ? 300 : -300,
                  opacity: 0,
                }),
                center: {
                  zIndex: 1,
                  x: 0,
                  opacity: 1,
                },
                exit: (direction: number) => ({
                  zIndex: 0,
                  x: direction < 0 ? 300 : -300,
                  opacity: 0,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              className="main-banner__slide absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <Card className="main-banner__card w-full h-full rounded-3xl overflow-hidden border-0 bg-gradient-banner">
                <CardContent className="main-banner__content relative p-0 w-full h-full">
                  <img
                    className="main-banner__bg absolute inset-0 w-full h-full object-cover pointer-events-none"
                    alt="Hero background"
                    src={bannerSlides[currentSlide].bgImage}
                  />

                  <div className="relative z-10 p-4 pointer-events-none">
                    <div className="[font-family:'Inter',Helvetica] font-semibold text-foreground text-lg tracking-[-0.36px] mt-4">
                      {currentSlide === 0 ? t("main.openCases") : bannerSlides[currentSlide].title}
                    </div>

                    <div className="main-banner__highlight bg-gradient-text [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-bold text-2xl tracking-[-0.48px] mt-1">
                      {currentSlide === 0 ? t("main.win") : bannerSlides[currentSlide].highlight}
                    </div>

                    <div className="mt-3 flex gap-1.5 items-center px-2.5 py-1.5 bg-foreground/10 rounded-full w-fit backdrop-blur-sm pointer-events-auto">
                      {bannerSlides.map((_, index) => (
                        <motion.button
                          key={index}
                          onClick={() => {
                            const newDirection = index > currentSlide ? 1 : -1;
                            setCurrentSlide(index);
                            setPage([index, newDirection]);
                          }}
                          className={`main-banner__dot h-1 rounded-full transition-all duration-500 ease-in-out ${
                            index === currentSlide 
                              ? "bg-foreground w-8" 
                              : "bg-foreground/40 w-1"
                          }`}
                          animate={{
                            width: index === currentSlide ? 32 : 4,
                            opacity: index === currentSlide ? 1 : 0.4,
                          }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          data-testid={`slide-indicator-${index}`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="px-4 pb-6"
      >
        <div className="inline-flex items-center gap-1.5 mb-3">
          <img
            className="w-6 h-6"
            alt="Games icon"
            src="/figmaAssets/fluent-games-20-filled.svg"
          />
          <h2 className="[font-family:'Inter',Helvetica] font-bold text-foreground text-lg tracking-[-0.36px]">
            {t("main.popularGames")}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{ 
              scale: 1.01, 
              y: -2,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            whileTap={{ 
              scale: 0.99,
              transition: { duration: 0.1 }
            }}
            className="col-span-2 cursor-pointer"
            data-testid="banner-cases"
          >
            <img
              className="w-full h-auto rounded-3xl"
              alt="Cases banner"
              src="/figmaAssets/cases-banner.svg"
            />
          </motion.div>

          {gameCards.map((game, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.5 + index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{ 
                scale: 1.02, 
                y: -3,
                transition: { duration: 0.15, ease: "easeOut" }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
              data-testid={`card-game-${game.title.toLowerCase()}`}
            >
              <Card className="relative w-full h-[200px] rounded-3xl overflow-hidden border-0 cursor-pointer transition-all duration-200">
                <CardContent className="relative p-0 w-full h-full">
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <div
                      className="absolute w-[200%] h-[200%]"
                      style={{
                        backgroundImage: `url(${gameCardsImg})`,
                        backgroundSize: "100% 100%",
                        top: index < 2 ? "0%" : "-100%",
                        left: index % 2 === 0 ? "0%" : "-100%",
                      }}
                    />
                  </div>

                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};
