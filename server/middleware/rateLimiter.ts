import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

export const gameLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many game attempts, please slow down",
  standardHeaders: true,
  legacyHeaders: false,
});

export const depositLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many deposit requests",
  standardHeaders: true,
  legacyHeaders: false,
});
