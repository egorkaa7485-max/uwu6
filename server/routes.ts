import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import { authenticateUser, requireAuth } from "./middleware/auth";
import { apiLimiter, gameLimiter, depositLimiter } from "./middleware/rateLimiter";
import {
  generateServerSeed,
  generateClientSeed,
  calculateResult,
  selectItemFromWeights,
  calculateUpgradeChance,
  flipCoin,
} from "./utils/provablyFair";
import { generateToken } from "./utils/jwt";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  app.use("/api", apiLimiter);

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { initData } = req.body;
      
      if (!initData) {
        return res.status(400).json({ error: "initData is required" });
      }

      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (!botToken) {
        return res.status(500).json({ error: "Bot token not configured" });
      }

      const { validateTelegramInitData } = await import("./utils/telegramAuth");
      const validated = validateTelegramInitData(initData, botToken);
      
      if (!validated || !validated.user) {
        return res.status(401).json({ error: "Invalid Telegram authentication data" });
      }

      let user = await storage.getUserByTelegramId(String(validated.user.id));
      
      if (!user) {
        user = await storage.createUser({
          telegramId: String(validated.user.id),
          username: validated.user.username || `user${validated.user.id}`,
          firstName: validated.user.first_name || null,
          lastName: validated.user.last_name || null,
          photoUrl: validated.user.photo_url || null,
          languageCode: validated.user.language_code || "ru",
        });
      }

      const token = generateToken({
        userId: user.id,
        telegramId: user.telegramId,
      });

      res.json({ user, token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  app.use("/api", authenticateUser);

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    res.json({ user: req.user });
  });

  app.get("/api/user/profile", requireAuth, async (req, res) => {
    res.json({ user: req.user });
  });

  app.get("/api/user/balance", requireAuth, async (req, res) => {
    const user = await storage.getUserById(req.user.id);
    res.json({ balance: user?.balance || "0" });
  });

  app.post("/api/user/deposit", requireAuth, depositLimiter, async (req, res) => {
    const { amount } = req.body;
    
    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const balanceBefore = req.user.balance;
    const updatedUser = await storage.updateBalance(req.user.id, parseFloat(amount));
    
    await storage.createTransaction({
      userId: req.user.id,
      type: "deposit",
      amount: amount,
      balanceBefore,
      balanceAfter: updatedUser?.balance || balanceBefore,
      description: "Balance deposit",
    });

    res.json({ balance: updatedUser?.balance, success: true });
  });

  app.get("/api/user/transactions", requireAuth, async (req, res) => {
    const transactions = await storage.getUserTransactions(req.user.id);
    res.json({ transactions });
  });

  app.get("/api/user/inventory", requireAuth, async (req, res) => {
    const inventory = await storage.getUserInventory(req.user.id);
    const inventoryWithItems = await Promise.all(
      inventory.map(async (inv) => {
        const item = await storage.getItemById(inv.itemId);
        return { ...inv, item };
      })
    );
    res.json({ inventory: inventoryWithItems });
  });

  app.get("/api/cases", async (req, res) => {
    const cases = await storage.getAllCases();
    res.json({ cases });
  });

  app.get("/api/cases/:id", async (req, res) => {
    const caseData = await storage.getCaseById(req.params.id);
    if (!caseData) {
      return res.status(404).json({ error: "Case not found" });
    }
    res.json({ case: caseData });
  });

  app.post("/api/cases/:id/open", requireAuth, gameLimiter, async (req, res) => {
    const caseData = await storage.getCaseById(req.params.id);
    if (!caseData) {
      return res.status(404).json({ error: "Case not found" });
    }

    const user = await storage.getUserById(req.user.id);
    if (!user || parseFloat(user.balance || "0") < parseFloat(caseData.price)) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    const serverSeed = generateServerSeed();
    const clientSeed = req.body.clientSeed || generateClientSeed();
    const nonce = Math.floor(Math.random() * 1000000);

    const randomValue = calculateResult(serverSeed, clientSeed, nonce);
    const wonItemId = selectItemFromWeights(caseData.items as any[], randomValue);
    const wonItem = await storage.getItemById(wonItemId);

    if (!wonItem) {
      return res.status(500).json({ error: "Item not found" });
    }

    const balanceBefore = user.balance || "0";
    await storage.updateBalance(req.user.id, -parseFloat(caseData.price));

    await storage.addToInventory(req.user.id, wonItemId);

    await storage.createTransaction({
      userId: req.user.id,
      type: "case_open",
      amount: `-${caseData.price}`,
      balanceBefore,
      balanceAfter: (parseFloat(balanceBefore) - parseFloat(caseData.price)).toFixed(2),
      description: `Opened ${caseData.name}`,
      metadata: { caseId: caseData.id, itemId: wonItemId } as any,
    });

    await storage.createGameHistory({
      userId: req.user.id,
      gameType: "case",
      betAmount: caseData.price,
      payout: wonItem.value,
      result: { itemId: wonItemId, itemName: wonItem.name },
      serverSeed,
      clientSeed,
      nonce,
    });

    const updatedUser = await storage.getUserById(req.user.id);
    
    res.json({
      item: wonItem,
      serverSeed,
      clientSeed,
      nonce,
      balance: updatedUser?.balance,
    });
  });

  app.post("/api/game/upgrade", requireAuth, gameLimiter, async (req, res) => {
    const { inventoryItemId, targetItemId, clientSeed: userClientSeed } = req.body;

    if (!inventoryItemId || !targetItemId) {
      return res.status(400).json({ error: "Inventory item ID and target item ID are required" });
    }

    const inventory = await storage.getUserInventory(req.user.id);
    const ownedItem = inventory.find(inv => inv.id === inventoryItemId && !inv.withdrawn);
    
    if (!ownedItem) {
      return res.status(403).json({ error: "Item not found in inventory or already withdrawn" });
    }

    const item = await storage.getItemById(ownedItem.itemId);
    const targetItem = await storage.getItemById(targetItemId);

    if (!item || !targetItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    const chance = calculateUpgradeChance(parseFloat(item.value), parseFloat(targetItem.value));
    
    const serverSeed = generateServerSeed();
    const clientSeed = userClientSeed || generateClientSeed();
    const nonce = Math.floor(Math.random() * 1000000);

    const randomValue = calculateResult(serverSeed, clientSeed, nonce);
    const success = randomValue * 100 < chance;

    await storage.markInventoryItemWithdrawn(inventoryItemId);

    await storage.createUpgradeAttempt({
      userId: req.user.id,
      sourceItemId: item.id,
      targetItemId: targetItem.id,
      successChance: chance.toFixed(2),
      success,
      resultItemId: success ? targetItem.id : null,
    });

    if (success) {
      await storage.addToInventory(req.user.id, targetItemId);
    }

    await storage.createGameHistory({
      userId: req.user.id,
      gameType: "upgrade",
      betAmount: item.value,
      payout: success ? targetItem.value : "0",
      result: { success, fromItem: item.name, toItem: targetItem.name, chance },
      serverSeed,
      clientSeed,
      nonce,
    });

    const updatedUser = await storage.getUserById(req.user.id);
    
    res.json({
      success,
      item: success ? targetItem : null,
      chance,
      serverSeed,
      clientSeed,
      nonce,
      balance: updatedUser?.balance,
    });
  });

  app.get("/api/game/coinflip/active", async (req, res) => {
    const games = await storage.getActiveCoinflipGames();
    res.json({ games });
  });

  app.post("/api/game/coinflip/create", requireAuth, gameLimiter, async (req, res) => {
    const { betAmount, side } = req.body;

    if (!betAmount || parseFloat(betAmount) <= 0) {
      return res.status(400).json({ error: "Invalid bet amount" });
    }

    const user = await storage.getUserById(req.user.id);
    if (!user || parseFloat(user.balance || "0") < parseFloat(betAmount)) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    await storage.updateBalance(req.user.id, -parseFloat(betAmount));

    const game = await storage.createCoinflipGame({
      creatorId: req.user.id,
      betAmount,
      creatorSide: side,
      status: "waiting",
    });

    res.json({ game });
  });

  app.post("/api/game/coinflip/:id/join", requireAuth, gameLimiter, async (req, res) => {
    const game = await storage.getCoinflipGame(req.params.id);
    
    if (!game || game.status !== "waiting") {
      return res.status(400).json({ error: "Game not available" });
    }

    if (game.creatorId === req.user.id) {
      return res.status(400).json({ error: "Cannot join your own game" });
    }

    const user = await storage.getUserById(req.user.id);
    if (!user || parseFloat(user.balance || "0") < parseFloat(game.betAmount)) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    await storage.updateBalance(req.user.id, -parseFloat(game.betAmount));

    const serverSeed = generateServerSeed();
    const clientSeed = req.body.clientSeed || generateClientSeed();
    const result = flipCoin(serverSeed, clientSeed);
    
    const winnerId = result === game.creatorSide ? game.creatorId : req.user.id;
    const winAmount = parseFloat(game.betAmount) * 2 * 0.95;

    await storage.updateBalance(winnerId, winAmount);

    const updatedGame = await storage.updateCoinflipGame(req.params.id, {
      joinerId: req.user.id,
      result,
      winnerId,
      status: "completed",
      serverSeed,
      clientSeed,
      completedAt: new Date(),
    });

    const updatedUser = await storage.getUserById(req.user.id);
    
    res.json({ 
      game: updatedGame, 
      result, 
      winnerId,
      balance: updatedUser?.balance,
    });
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("chat:join", async (data) => {
      const { userId } = data;
      
      let conversation = await storage.getUserConversation(userId);
      if (!conversation) {
        conversation = await storage.createConversation(userId);
      }

      socket.join(`conversation:${conversation.id}`);
      
      const messages = await storage.getConversationMessages(conversation.id);
      socket.emit("chat:history", { messages });
    });

    socket.on("chat:message", async (data) => {
      const { userId, text, conversationId } = data;
      
      const message = await storage.createMessage({
        conversationId,
        senderType: "user",
        senderId: userId,
        text,
      });

      io.to(`conversation:${conversationId}`).emit("chat:new_message", { message });
    });

    socket.on("chat:typing", (data) => {
      const { conversationId } = data;
      socket.to(`conversation:${conversationId}`).emit("chat:user_typing");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return httpServer;
}
