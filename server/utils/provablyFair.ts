import crypto from "crypto";

export function generateServerSeed(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function generateClientSeed(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function calculateResult(serverSeed: string, clientSeed: string, nonce: number): number {
  const combined = `${serverSeed}:${clientSeed}:${nonce}`;
  const hash = crypto.createHash("sha256").update(combined).digest("hex");
  const first8Chars = hash.substring(0, 8);
  const decimal = parseInt(first8Chars, 16);
  return decimal / 0xffffffff;
}

export function selectItemFromWeights(items: { id: string; weight: number }[], randomValue: number): string {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const targetValue = randomValue * totalWeight;
  
  let currentWeight = 0;
  for (const item of items) {
    currentWeight += item.weight;
    if (targetValue <= currentWeight) {
      return item.id;
    }
  }
  
  return items[items.length - 1].id;
}

export function calculateUpgradeChance(currentValue: number, targetValue: number): number {
  if (targetValue <= currentValue) return 95;
  const ratio = currentValue / targetValue;
  return Math.min(95, Math.max(5, ratio * 100));
}

export function flipCoin(serverSeed: string, clientSeed: string): "heads" | "tails" {
  const result = calculateResult(serverSeed, clientSeed, 0);
  return result < 0.5 ? "heads" : "tails";
}
