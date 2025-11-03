import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

const isDevelopment = process.env.NODE_ENV === 'development';

let JWT_SECRET: string;

if (process.env.JWT_SECRET) {
  JWT_SECRET = process.env.JWT_SECRET;
} else if (isDevelopment) {
  JWT_SECRET = randomBytes(32).toString('hex');
  console.warn('\n⚠️  WARNING: JWT_SECRET not set. Using randomly generated secret for development.');
  console.warn('⚠️  This will invalidate all tokens on server restart.');
  console.warn('⚠️  Set JWT_SECRET environment variable for production.\n');
} else {
  throw new Error('FATAL: JWT_SECRET environment variable must be set in production');
}

const JWT_EXPIRES_IN = '7d';

export interface JWTPayload {
  userId: string;
  telegramId: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}
