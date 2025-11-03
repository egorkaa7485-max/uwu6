import axios from "axios";
import { getTelegramInitData } from "./telegram";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const initData = getTelegramInitData();
  if (initData) {
    config.headers["x-telegram-init-data"] = initData;
  }
  return config;
});

export const authAPI = {
  login: () => api.post("/auth/login"),
};

export const userAPI = {
  getProfile: () => api.get("/user/profile"),
  getBalance: () => api.get("/user/balance"),
  deposit: (amount: number) => api.post("/user/deposit", { amount }),
  getTransactions: () => api.get("/user/transactions"),
  getInventory: () => api.get("/user/inventory"),
};

export const casesAPI = {
  getAll: () => api.get("/cases"),
  getById: (id: string) => api.get(`/cases/${id}`),
  open: (id: string, clientSeed?: string) => api.post(`/cases/${id}/open`, { clientSeed }),
};

export const gamesAPI = {
  upgrade: (itemId: string, targetItemId: string, clientSeed?: string) =>
    api.post("/game/upgrade", { itemId, targetItemId, clientSeed }),
  
  coinflip: {
    getActive: () => api.get("/game/coinflip/active"),
    create: (betAmount: number, side: "heads" | "tails") =>
      api.post("/game/coinflip/create", { betAmount, side }),
    join: (gameId: string, clientSeed?: string) =>
      api.post(`/game/coinflip/${gameId}/join`, { clientSeed }),
  },
};

export default api;
