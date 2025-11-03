import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  telegramId: varchar("telegram_id").notNull().unique(),
  username: text("username").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  photoUrl: text("photo_url"),
  languageCode: varchar("language_code", { length: 10 }).default("ru"),
  balance: decimal("balance", { precision: 20, scale: 2 }).default("0"),
  level: integer("level").default(1),
  xp: integer("xp").default(0),
  totalWagered: decimal("total_wagered", { precision: 20, scale: 2 }).default("0"),
  totalWon: decimal("total_won", { precision: 20, scale: 2 }).default("0"),
  gamesPlayed: integer("games_played").default(0),
  referredBy: varchar("referred_by"),
  referralCode: varchar("referral_code").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cases = pgTable("cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  price: decimal("price", { precision: 20, scale: 2 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  items: jsonb("items").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  rarity: varchar("rarity", { length: 20 }).notNull(),
  value: decimal("value", { precision: 20, scale: 2 }).notNull(),
  category: varchar("category", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inventory = pgTable("inventory", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  itemId: varchar("item_id").notNull(),
  acquiredAt: timestamp("acquired_at").defaultNow(),
  withdrawn: boolean("withdrawn").default(false),
  withdrawnAt: timestamp("withdrawn_at"),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  amount: decimal("amount", { precision: 20, scale: 2 }).notNull(),
  balanceBefore: decimal("balance_before", { precision: 20, scale: 2 }).notNull(),
  balanceAfter: decimal("balance_after", { precision: 20, scale: 2 }).notNull(),
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gameHistory = pgTable("game_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  gameType: varchar("game_type", { length: 20 }).notNull(),
  betAmount: decimal("bet_amount", { precision: 20, scale: 2 }).notNull(),
  payout: decimal("payout", { precision: 20, scale: 2 }).notNull(),
  result: jsonb("result").notNull(),
  serverSeed: text("server_seed").notNull(),
  clientSeed: text("client_seed").notNull(),
  nonce: integer("nonce").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const coinflipGames = pgTable("coinflip_games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").notNull(),
  joinerId: varchar("joiner_id"),
  betAmount: decimal("bet_amount", { precision: 20, scale: 2 }).notNull(),
  creatorSide: varchar("creator_side", { length: 10 }).notNull(),
  result: varchar("result", { length: 10 }),
  winnerId: varchar("winner_id"),
  status: varchar("status", { length: 20 }).notNull().default("waiting"),
  serverSeed: text("server_seed"),
  clientSeed: text("client_seed"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("open"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull(),
  senderType: varchar("sender_type", { length: 20 }).notNull(),
  senderId: varchar("sender_id").notNull(),
  text: text("text").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Case = typeof cases.$inferSelect;
export type Item = typeof items.$inferSelect;
export type Inventory = typeof inventory.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type GameHistory = typeof gameHistory.$inferSelect;
export type CoinflipGame = typeof coinflipGames.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;

export const insertUserSchema = createInsertSchema(users);
export const insertCaseSchema = createInsertSchema(cases);
export const insertItemSchema = createInsertSchema(items);
export const insertInventorySchema = createInsertSchema(inventory);
export const insertTransactionSchema = createInsertSchema(transactions);
export const insertGameHistorySchema = createInsertSchema(gameHistory);
export const insertCoinflipGameSchema = createInsertSchema(coinflipGames);
export const insertConversationSchema = createInsertSchema(conversations);
export const insertMessageSchema = createInsertSchema(messages);
