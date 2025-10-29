import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const languages = [
  { code: "en" as const, name: "English", localName: "English" },
  { code: "ru" as const, name: "Russian", localName: "Русский" },
  { code: "fa" as const, name: "Persian", localName: "فارسی" },
  { code: "zh" as const, name: "Chinese", localName: "中文" },
];

export const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageSelect = (code: "en" | "ru" | "fa" | "zh") => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className="text-white hover:bg-white/10 transition-all duration-300 p-2"
        data-testid="button-language"
      >
        <Globe className="w-6 h-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-[#1a1b1f] rounded-t-3xl z-50 max-w-[600px] mx-auto"
            >
              <div className="p-6">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="[font-family:'Inter',Helvetica] font-bold text-white text-xl text-center mb-6"
                >
                  {t("lang.changeLanguage")}
                </motion.h2>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {languages.map((lang, index) => (
                    <motion.div
                      key={lang.code}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + index * 0.05 }}
                    >
                      <Button
                        onClick={() => handleLanguageSelect(lang.code)}
                        data-testid={`button-lang-${lang.code}`}
                        className={`w-full h-12 rounded-2xl [font-family:'Inter',Helvetica] font-semibold transition-all duration-300 hover:scale-[1.02] ${
                          language === lang.code
                            ? "bg-[#c3ff00] text-[#242424] hover:bg-[#b3ef00]"
                            : "bg-[#242424] text-white hover:bg-[#333]"
                        }`}
                      >
                        {lang.localName}
                      </Button>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <Button
                    onClick={() => setIsOpen(false)}
                    data-testid="button-close-language"
                    className="w-full h-12 bg-transparent border border-gray-600 text-white hover:bg-white/5 rounded-2xl [font-family:'Inter',Helvetica] font-semibold transition-all duration-300"
                  >
                    {t("lang.close")}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
