import { Request, Response, NextFunction } from "express";
import { validateTelegramInitData, mockTelegramUser } from "../utils/telegramAuth";
import { storage } from "../storage";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const initData = req.headers["x-telegram-init-data"] as string;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    const isDev = process.env.NODE_ENV === "development";
    
    if (!initData || !botToken) {
      if (isDev) {
        const telegramData = mockTelegramUser(Math.floor(Math.random() * 1000000));
        if (!telegramData.user) {
          return res.status(401).json({ error: "User data missing" });
        }
        
        let user = await storage.getUserByTelegramId(String(telegramData.user.id));
        
        if (!user) {
          user = await storage.createUser({
            telegramId: String(telegramData.user.id),
            username: telegramData.user.username || `user${telegramData.user.id}`,
            firstName: telegramData.user.first_name,
            lastName: telegramData.user.last_name,
            photoUrl: telegramData.user.photo_url,
            languageCode: telegramData.user.language_code || "ru",
          });
        }
        
        req.user = user;
        return next();
      }
      return res.status(401).json({ error: "Missing Telegram authentication data" });
    }
    
    const validated = validateTelegramInitData(initData, botToken);
    if (!validated) {
      return res.status(401).json({ error: "Invalid Telegram data" });
    }
    
    if (!validated.user) {
      return res.status(401).json({ error: "User data missing" });
    }
    
    let user = await storage.getUserByTelegramId(String(validated.user.id));
    
    if (!user) {
      user = await storage.createUser({
        telegramId: String(validated.user.id),
        username: validated.user.username || `user${validated.user.id}`,
        firstName: validated.user.first_name,
        lastName: validated.user.last_name,
        photoUrl: validated.user.photo_url,
        languageCode: validated.user.language_code || "ru",
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
