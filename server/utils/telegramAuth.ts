import crypto from "crypto";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

export interface TelegramInitData {
  user?: TelegramUser;
  auth_date: number;
  hash: string;
  [key: string]: any;
}

export function validateTelegramInitData(initDataString: string, botToken: string): TelegramInitData | null {
  try {
    const params = new URLSearchParams(initDataString);
    const hash = params.get("hash");
    
    if (!hash) return null;
    
    params.delete("hash");
    
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");
    
    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();
    
    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");
    
    if (calculatedHash !== hash) {
      console.error("Hash validation failed");
      return null;
    }
    
    const authDate = parseInt(params.get("auth_date") || "0");
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (currentTime - authDate > 86400) {
      console.error("Data is too old");
      return null;
    }
    
    const userStr = params.get("user");
    const user = userStr ? JSON.parse(userStr) : undefined;
    
    return {
      user,
      auth_date: authDate,
      hash,
    };
  } catch (error) {
    console.error("Telegram auth validation error:", error);
    return null;
  }
}

export function mockTelegramUser(id: number = 123456789): TelegramInitData {
  return {
    user: {
      id,
      first_name: "Test",
      last_name: "User",
      username: "testuser",
      language_code: "ru",
    },
    auth_date: Math.floor(Date.now() / 1000),
    hash: "mock_hash",
  };
}
