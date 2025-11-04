import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Copy, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

export const Profile = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("referral");
  const { t } = useLanguage();

  const leaderboardData = [
    { name: "Maxim", points: `330 000 ${t("profile.points")}` },
    { name: "Maxim", points: `330 000 ${t("profile.points")}` },
    { name: "Maxim", points: `330 000 ${t("profile.points")}` },
    { name: "Maxim", points: `330 000 ${t("profile.points")}` },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + "/ref/12345");
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div className="profile bg-background w-full min-h-screen flex flex-col max-w-[600px] mx-auto">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between px-4 py-4"
      >
        <Button
          variant="ghost"
          onClick={() => setLocation("/main")}
          data-testid="button-main"
          className="text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all duration-300 [font-family:'Inter',Helvetica] font-semibold text-sm"
        >
          ← {t("profile.main")}
        </Button>
        
        <LanguageSelector />
      </motion.header>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="profile__container px-4 mb-6"
      >
        <div className="profile__header flex flex-col items-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="profile__avatar w-20 h-20 rounded-full bg-gradient-to-br from-avatar-from to-avatar-to mb-3 flex items-center justify-center shadow-lg"
          >
            <span className="text-foreground text-2xl font-bold">M</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="profile__name flex items-center gap-2"
          >
            <h1 className="[font-family:'Inter',Helvetica] font-bold text-foreground text-xl tracking-[-0.40px]">
              Maxim
            </h1>
            <div className="w-1 h-1 rounded-full bg-divider" />
            <span className="relative [font-family:'Inter',Helvetica] text-foreground text-sm px-3 py-1">
              <span className="absolute inset-0 bg-lime/20 rounded-full" />
              <span className="relative">lvl 1</span>
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            className="profile__connect w-full h-12 bg-lime hover:bg-lime/90 rounded-3xl mb-6 transition-all duration-300 hover:scale-[1.02]"
            data-testid="button-connect-wallet"
          >
            <span className="[font-family:'Inter',Helvetica] font-bold text-primary-foreground text-base">
              {t("profile.connectWallet")}
            </span>
          </Button>

          <Button
            className="w-full h-12 bg-zinc-800 hover:bg-zinc-700 rounded-3xl mb-6 transition-all duration-300 hover:scale-[1.02]"
            onClick={() => setLocation("/support")}
            data-testid="button-support"
          >
            <span className="[font-family:'Inter',Helvetica] font-semibold text-white text-base">
              Связаться с поддержкой
            </span>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <h2 className="[font-family:'Inter',Helvetica] font-bold text-foreground text-lg tracking-[-0.36px] mb-3">
            {t("profile.yourInventory")}
          </h2>
          <Card className="profile__inventory bg-card border-0 rounded-3xl p-6 min-h-[100px] flex items-center justify-center">
            <p className="text-muted-foreground [font-family:'Inter',Helvetica]">{t("profile.noItems")}</p>
          </Card>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <TabsList className="grid w-full grid-cols-2 bg-card rounded-3xl p-1 mb-4">
              <TabsTrigger
                value="referral"
                data-testid="tab-referral"
                className="rounded-3xl data-[state=active]:bg-lime/20 data-[state=active]:text-foreground text-muted-foreground [font-family:'Inter',Helvetica] font-semibold transition-all duration-300"
              >
                {t("profile.referralSystem")}
              </TabsTrigger>
              <TabsTrigger
                value="leaderboard"
                data-testid="tab-leaderboard"
                className="rounded-3xl data-[state=active]:bg-lime/20 data-[state=active]:text-foreground text-muted-foreground [font-family:'Inter',Helvetica] font-semibold transition-all duration-300"
              >
                {t("profile.leaderboard")}
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="referral" className="mt-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-card border-0 rounded-3xl p-6 mb-4">
                <h3 className="[font-family:'Inter',Helvetica] font-bold text-foreground text-base mb-4">
                  {t("profile.referralBalance")}
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="[font-family:'Inter',Helvetica] font-bold text-foreground text-2xl mb-1">
                      0
                    </div>
                    <div className="[font-family:'Inter',Helvetica] text-muted-foreground text-sm">
                      ~ $0
                    </div>
                  </div>
                  <div>
                    <div className="[font-family:'Inter',Helvetica] font-bold text-foreground text-2xl mb-1">
                      0
                    </div>
                    <div className="[font-family:'Inter',Helvetica] text-muted-foreground text-sm">
                      {t("profile.invited")}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleCopyLink}
                    data-testid="button-copy-link"
                    className="bg-secondary hover:bg-secondary/80 text-foreground rounded-2xl h-11 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    <span className="[font-family:'Inter',Helvetica] font-semibold text-sm">
                      {t("profile.copyLink")}
                    </span>
                  </Button>
                  <Button
                    data-testid="button-withdraw"
                    className="bg-lime hover:bg-lime/90 text-primary-foreground rounded-2xl h-11 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    <span className="[font-family:'Inter',Helvetica] font-semibold text-sm">
                      {t("profile.withdraw")}
                    </span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-card border-0 rounded-3xl p-4">
                {leaderboardData.map((user, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 hover:bg-foreground/5 rounded-2xl transition-all duration-300 mb-2 last:mb-0"
                    data-testid={`leaderboard-entry-${index}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-avatar-from to-avatar-to flex items-center justify-center flex-shrink-0">
                      <span className="text-foreground text-xs font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="[font-family:'Inter',Helvetica] font-semibold text-foreground text-sm">
                        {user.name}
                      </div>
                      <div className="[font-family:'Inter',Helvetica] text-muted-foreground text-xs">
                        {user.points}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};
