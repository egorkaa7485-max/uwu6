import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
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
    const authHeader = req.headers.authorization;
    const token = req.headers["x-auth-token"] as string || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null);
    
    if (!token) {
      return next();
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return next();
    }
    
    const user = await storage.getUserById(decoded.userId);
    if (user) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    next();
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
