import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useTelegram } from "./TelegramProvider";

type Language = "en" | "ru" | "fa" | "zh";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Main page
    "main.openCases": "Open cases and",
    "main.win": "win $10 000",
    "main.popularGames": "Popular Games",
    "main.connectWallet": "Connect Wallet",
    // Profile page
    "profile.main": "Main",
    "profile.connectWallet": "Connect Wallet",
    "profile.yourInventory": "Your inventory",
    "profile.noItems": "No items yet",
    "profile.referralSystem": "Referral system",
    "profile.leaderboard": "Leaderboard",
    "profile.referralBalance": "Referral balance",
    "profile.invited": "Invited",
    "profile.copyLink": "Copy link",
    "profile.withdraw": "Withdraw",
    "profile.points": "points",
    // Language dialog
    "lang.changeLanguage": "Change language",
    "lang.english": "English",
    "lang.russian": "Russian",
    "lang.persian": "Persian",
    "lang.chinese": "Chinese",
    "lang.close": "Close",
  },
  ru: {
    // Main page
    "main.openCases": "Открывайте кейсы и",
    "main.win": "выигрывайте $10 000",
    "main.popularGames": "Популярные игры",
    "main.connectWallet": "Подключить кошелек",
    // Profile page
    "profile.main": "Главная",
    "profile.connectWallet": "Подключить кошелек",
    "profile.yourInventory": "Ваш инвентарь",
    "profile.noItems": "Пока нет предметов",
    "profile.referralSystem": "Реферальная система",
    "profile.leaderboard": "Таблица лидеров",
    "profile.referralBalance": "Реферальный баланс",
    "profile.invited": "Приглашено",
    "profile.copyLink": "Копировать ссылку",
    "profile.withdraw": "Вывести",
    "profile.points": "очков",
    // Language dialog
    "lang.changeLanguage": "Изменить язык",
    "lang.english": "Английский",
    "lang.russian": "Русский",
    "lang.persian": "Персидский",
    "lang.chinese": "Китайский",
    "lang.close": "Закрыть",
  },
  fa: {
    // Main page
    "main.openCases": "جعبه ها را باز کنید و",
    "main.win": "$10 000 برنده شوید",
    "main.popularGames": "بازی های محبوب",
    "main.connectWallet": "اتصال کیف پول",
    // Profile page
    "profile.main": "اصلی",
    "profile.connectWallet": "اتصال کیف پول",
    "profile.yourInventory": "موجودی شما",
    "profile.noItems": "هنوز موردی وجود ندارد",
    "profile.referralSystem": "سیستم معرفی",
    "profile.leaderboard": "جدول امتیازات",
    "profile.referralBalance": "موجودی معرفی",
    "profile.invited": "دعوت شده",
    "profile.copyLink": "کپی لینک",
    "profile.withdraw": "برداشت",
    "profile.points": "امتیاز",
    // Language dialog
    "lang.changeLanguage": "تغییر زبان",
    "lang.english": "انگلیسی",
    "lang.russian": "روسی",
    "lang.persian": "فارسی",
    "lang.chinese": "چینی",
    "lang.close": "بستن",
  },
  zh: {
    // Main page
    "main.openCases": "打开箱子",
    "main.win": "赢取 $10 000",
    "main.popularGames": "热门游戏",
    "main.connectWallet": "连接钱包",
    // Profile page
    "profile.main": "主页",
    "profile.connectWallet": "连接钱包",
    "profile.yourInventory": "您的物品",
    "profile.noItems": "暂无物品",
    "profile.referralSystem": "推荐系统",
    "profile.leaderboard": "排行榜",
    "profile.referralBalance": "推荐余额",
    "profile.invited": "已邀请",
    "profile.copyLink": "复制链接",
    "profile.withdraw": "提现",
    "profile.points": "分",
    // Language dialog
    "lang.changeLanguage": "更改语言",
    "lang.english": "英语",
    "lang.russian": "俄语",
    "lang.persian": "波斯语",
    "lang.chinese": "中文",
    "lang.close": "关闭",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useTelegram();
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("selectedLanguage") as Language;
    return saved || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("selectedLanguage", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    const saved = localStorage.getItem("selectedLanguage") as Language | null;
    if (!saved && user?.language_code) {
      const langCode = user.language_code.startsWith("ru") ? "ru" : user.language_code.startsWith("zh") ? "zh" : user.language_code.startsWith("fa") ? "fa" : "en";
      setLanguage(langCode as Language);
    }
  }, [user?.language_code]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
