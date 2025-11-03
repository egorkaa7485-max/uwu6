import { 
  type User, type InsertUser, type Case, type Item, 
  type Inventory, type Transaction, type GameHistory,
  type CoinflipGame, type Conversation, type Message,
  type UpgradeAttempt, type CaseOpening
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUserById(id: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  createUser(user: Partial<InsertUser>): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  updateBalance(userId: string, amount: number): Promise<User | undefined>;
  
  getAllCases(): Promise<Case[]>;
  getCaseById(id: string): Promise<Case | undefined>;
  
  getItemById(id: string): Promise<Item | undefined>;
  getAllItems(): Promise<Item[]>;
  
  addToInventory(userId: string, itemId: string): Promise<Inventory>;
  getUserInventory(userId: string): Promise<Inventory[]>;
  markInventoryItemWithdrawn(inventoryId: string): Promise<Inventory | undefined>;
  
  createTransaction(tx: Partial<Transaction>): Promise<Transaction>;
  getUserTransactions(userId: string): Promise<Transaction[]>;
  
  createGameHistory(game: Partial<GameHistory>): Promise<GameHistory>;
  getUserGameHistory(userId: string): Promise<GameHistory[]>;
  
  createCoinflipGame(game: Partial<CoinflipGame>): Promise<CoinflipGame>;
  getCoinflipGame(id: string): Promise<CoinflipGame | undefined>;
  getActiveCoinflipGames(): Promise<CoinflipGame[]>;
  updateCoinflipGame(id: string, data: Partial<CoinflipGame>): Promise<CoinflipGame | undefined>;
  
  createConversation(userId: string): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | undefined>;
  getUserConversation(userId: string): Promise<Conversation | undefined>;
  
  createMessage(message: Partial<Message>): Promise<Message>;
  getConversationMessages(conversationId: string): Promise<Message[]>;
  markMessagesAsRead(conversationId: string): Promise<void>;
  
  createUpgradeAttempt(attempt: Partial<UpgradeAttempt>): Promise<UpgradeAttempt>;
  getUserUpgradeHistory(userId: string): Promise<UpgradeAttempt[]>;
  
  createCaseOpening(opening: Partial<CaseOpening>): Promise<CaseOpening>;
  getRecentCaseOpenings(limit?: number): Promise<CaseOpening[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private cases: Map<string, Case>;
  private items: Map<string, Item>;
  private inventory: Map<string, Inventory>;
  private transactions: Map<string, Transaction>;
  private gameHistory: Map<string, GameHistory>;
  private coinflipGames: Map<string, CoinflipGame>;
  private conversations: Map<string, Conversation>;
  private messages: Map<string, Message>;
  private upgradeAttempts: Map<string, UpgradeAttempt>;
  private caseOpenings: Map<string, CaseOpening>;

  constructor() {
    this.users = new Map();
    this.cases = new Map();
    this.items = new Map();
    this.inventory = new Map();
    this.transactions = new Map();
    this.gameHistory = new Map();
    this.coinflipGames = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.upgradeAttempts = new Map();
    this.caseOpenings = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockItems = [
      { id: randomUUID(), name: "Gold Coin", rarity: "common", value: "10", imageUrl: "/items/gold-coin.png" },
      { id: randomUUID(), name: "Silver Trophy", rarity: "rare", value: "50", imageUrl: "/items/silver-trophy.png" },
      { id: randomUUID(), name: "Diamond Ring", rarity: "epic", value: "200", imageUrl: "/items/diamond-ring.png" },
      { id: randomUUID(), name: "Legendary Sword", rarity: "legendary", value: "1000", imageUrl: "/items/legendary-sword.png" },
    ];
    mockItems.forEach(item => this.items.set(item.id, item as Item));
    
    const mockCase = {
      id: randomUUID(),
      name: "Starter Case",
      description: "Perfect for beginners!",
      imageUrl: "/cases/starter.png",
      price: "100",
      category: "starter",
      items: mockItems.map(item => ({ id: item.id, weight: 25 })),
      isActive: true,
      createdAt: new Date(),
    } as Case;
    this.cases.set(mockCase.id, mockCase);
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.telegramId === telegramId);
  }

  async createUser(userData: Partial<InsertUser>): Promise<User> {
    const id = randomUUID();
    const referralCode = `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const user: User = {
      id,
      telegramId: userData.telegramId || "",
      username: userData.username || "User",
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      photoUrl: userData.photoUrl || null,
      languageCode: userData.languageCode || "ru",
      balance: "0",
      level: 1,
      xp: 0,
      totalWagered: "0",
      totalWon: "0",
      gamesPlayed: 0,
      referredBy: userData.referredBy || null,
      referralCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...data, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  async updateBalance(userId: string, amount: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    const newBalance = (parseFloat(user.balance || "0") + amount).toFixed(2);
    return this.updateUser(userId, { balance: newBalance });
  }

  async getAllCases(): Promise<Case[]> {
    return Array.from(this.cases.values());
  }

  async getCaseById(id: string): Promise<Case | undefined> {
    return this.cases.get(id);
  }

  async getItemById(id: string): Promise<Item | undefined> {
    return this.items.get(id);
  }

  async getAllItems(): Promise<Item[]> {
    return Array.from(this.items.values());
  }

  async addToInventory(userId: string, itemId: string): Promise<Inventory> {
    const id = randomUUID();
    const inv: Inventory = {
      id,
      userId,
      itemId,
      acquiredAt: new Date(),
      withdrawn: false,
      withdrawnAt: null,
    };
    this.inventory.set(id, inv);
    return inv;
  }

  async getUserInventory(userId: string): Promise<Inventory[]> {
    return Array.from(this.inventory.values()).filter(i => i.userId === userId);
  }

  async markInventoryItemWithdrawn(inventoryId: string): Promise<Inventory | undefined> {
    const item = this.inventory.get(inventoryId);
    if (!item) return undefined;
    const updated = { ...item, withdrawn: true, withdrawnAt: new Date() };
    this.inventory.set(inventoryId, updated);
    return updated;
  }

  async createTransaction(txData: Partial<Transaction>): Promise<Transaction> {
    const id = randomUUID();
    const tx: Transaction = {
      id,
      userId: txData.userId || "",
      type: txData.type || "unknown",
      amount: txData.amount || "0",
      balanceBefore: txData.balanceBefore || "0",
      balanceAfter: txData.balanceAfter || "0",
      description: txData.description || null,
      metadata: txData.metadata || null,
      createdAt: new Date(),
    };
    this.transactions.set(id, tx);
    return tx;
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(t => t.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createGameHistory(gameData: Partial<GameHistory>): Promise<GameHistory> {
    const id = randomUUID();
    const game: GameHistory = {
      id,
      userId: gameData.userId || "",
      gameType: gameData.gameType || "unknown",
      betAmount: gameData.betAmount || "0",
      payout: gameData.payout || "0",
      result: gameData.result || {},
      serverSeed: gameData.serverSeed || "",
      clientSeed: gameData.clientSeed || "",
      nonce: gameData.nonce || 0,
      createdAt: new Date(),
    };
    this.gameHistory.set(id, game);
    return game;
  }

  async getUserGameHistory(userId: string): Promise<GameHistory[]> {
    return Array.from(this.gameHistory.values())
      .filter(g => g.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createCoinflipGame(gameData: Partial<CoinflipGame>): Promise<CoinflipGame> {
    const id = randomUUID();
    const game: CoinflipGame = {
      id,
      creatorId: gameData.creatorId || "",
      joinerId: gameData.joinerId || null,
      betAmount: gameData.betAmount || "0",
      creatorSide: gameData.creatorSide || "heads",
      result: gameData.result || null,
      winnerId: gameData.winnerId || null,
      status: gameData.status || "waiting",
      serverSeed: gameData.serverSeed || null,
      clientSeed: gameData.clientSeed || null,
      createdAt: new Date(),
      completedAt: gameData.completedAt || null,
    };
    this.coinflipGames.set(id, game);
    return game;
  }

  async getCoinflipGame(id: string): Promise<CoinflipGame | undefined> {
    return this.coinflipGames.get(id);
  }

  async getActiveCoinflipGames(): Promise<CoinflipGame[]> {
    return Array.from(this.coinflipGames.values())
      .filter(g => g.status === "waiting")
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async updateCoinflipGame(id: string, data: Partial<CoinflipGame>): Promise<CoinflipGame | undefined> {
    const game = this.coinflipGames.get(id);
    if (!game) return undefined;
    const updated = { ...game, ...data };
    this.coinflipGames.set(id, updated);
    return updated;
  }

  async createConversation(userId: string): Promise<Conversation> {
    const id = randomUUID();
    const conv: Conversation = {
      id,
      userId,
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversations.set(id, conv);
    return conv;
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getUserConversation(userId: string): Promise<Conversation | undefined> {
    return Array.from(this.conversations.values())
      .find(c => c.userId === userId && c.status === "open");
  }

  async createMessage(msgData: Partial<Message>): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      id,
      conversationId: msgData.conversationId || "",
      senderType: msgData.senderType || "user",
      senderId: msgData.senderId || "",
      text: msgData.text || "",
      read: msgData.read || false,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  }

  async markMessagesAsRead(conversationId: string): Promise<void> {
    const messages = Array.from(this.messages.values())
      .filter(m => m.conversationId === conversationId);
    messages.forEach(m => {
      this.messages.set(m.id, { ...m, read: true });
    });
  }

  async createUpgradeAttempt(attemptData: Partial<UpgradeAttempt>): Promise<UpgradeAttempt> {
    const id = randomUUID();
    const attempt: UpgradeAttempt = {
      id,
      userId: attemptData.userId || "",
      sourceItemId: attemptData.sourceItemId || "",
      targetItemId: attemptData.targetItemId || "",
      successChance: attemptData.successChance || "0",
      success: attemptData.success || false,
      resultItemId: attemptData.resultItemId || null,
      createdAt: new Date(),
    };
    this.upgradeAttempts.set(id, attempt);
    return attempt;
  }

  async getUserUpgradeHistory(userId: string): Promise<UpgradeAttempt[]> {
    return Array.from(this.upgradeAttempts.values())
      .filter(a => a.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createCaseOpening(openingData: Partial<CaseOpening>): Promise<CaseOpening> {
    const id = randomUUID();
    const opening: CaseOpening = {
      id,
      userId: openingData.userId || "",
      caseId: openingData.caseId || "",
      itemWonId: openingData.itemWonId || "",
      serverSeed: openingData.serverSeed || "",
      clientSeed: openingData.clientSeed || "",
      createdAt: new Date(),
    };
    this.caseOpenings.set(id, opening);
    return opening;
  }

  async getRecentCaseOpenings(limit: number = 10): Promise<CaseOpening[]> {
    return Array.from(this.caseOpenings.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
