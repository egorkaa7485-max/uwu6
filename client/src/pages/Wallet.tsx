import { useState } from "react";
import { useBalance, useDeposit, useTransactions } from "@/hooks/useUser";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coins, TrendingUp, TrendingDown } from "lucide-react";
import { hapticFeedback } from "@/lib/telegram";

export default function Wallet() {
  const { data: balance } = useBalance();
  const { data: transactions } = useTransactions();
  const deposit = useDeposit();
  const [amount, setAmount] = useState("100");
  const [tonConnected, setTonConnected] = useState(false);

  const handleDeposit = () => {
    deposit.mutate(parseFloat(amount), {
      onSuccess: () => {
        hapticFeedback("success");
        setAmount("100");
      },
    });
  };

  return (
    <div className="wallet min-h-screen bg-zinc-950 text-white pb-20">
      <Header title="Кошелёк" />
      
      <div className="wallet__container p-4 max-w-md mx-auto space-y-4">
        <Card className="bg-gradient-to-br from-lime-500/20 to-green-500/20 border-lime-500/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Coins className="w-8 h-8 text-lime-500" />
            <div>
              <p className="text-sm text-zinc-300">Баланс</p>
              <p className="text-3xl font-bold text-lime-500">{balance || "0"} ⭐</p>
            </div>
          </div>
        </Card>

        <Card className="wallet__deposit bg-zinc-900 border-zinc-800 p-4">
          <h3 className="font-semibold mb-3">Пополнить баланс</h3>
          <div className="flex gap-2 mb-3">
            {["100", "500", "1000"].map((preset) => (
              <Button
                key={preset}
                size="sm"
                variant="outline"
                onClick={() => setAmount(preset)}
                className="flex-1"
              >
                {preset} ⭐
              </Button>
            ))}
          </div>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Сумма"
            className="mb-3 bg-zinc-800 border-zinc-700"
          />
          <Button
            onClick={handleDeposit}
            disabled={deposit.isPending}
            className="w-full bg-lime-500 hover:bg-lime-600 text-black font-bold"
          >
            Пополнить
          </Button>
        </Card>

        <Card className="wallet__methods bg-zinc-900 border-zinc-800 p-4 space-y-3">
          <h3 className="font-semibold">Способы пополнения</h3>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open("https://t.me/", "_blank")}
          >
            Telegram Stars (инструкция)
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open("https://t.me/", "_blank")}
          >
            Отправить подарок боту (диалог)
          </Button>
          <div className="flex items-center gap-2">
            <Button
              className="flex-1"
              variant={tonConnected ? "default" : "secondary"}
              onClick={() => setTonConnected((v) => !v)}
            >
              {tonConnected ? "TON Connected" : "TON Connect (placeholder)"}
            </Button>
            <Button
              disabled={!tonConnected}
              onClick={() => handleDeposit()}
            >
              Пополнить TON (demo)
            </Button>
          </div>
        </Card>

        <div className="wallet__history">
          <h3 className="font-semibold mb-3">История транзакций</h3>
          <div className="space-y-2">
            {transactions?.slice(0, 10).map((tx: any) => (
              <Card key={tx.id} className="bg-zinc-900 border-zinc-800 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {tx.type === "deposit" ? (
                      <TrendingUp className="w-5 h-5 text-lime-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-zinc-400">
                        {new Date(tx.createdAt).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    tx.type === "deposit" ? "text-lime-500" : "text-red-500"
                  }`}>
                    {tx.amount} ⭐
                  </div>
                </div>
              </Card>
            ))}
            {!transactions?.length && (
              <p className="text-center text-zinc-400 py-8">Нет транзакций</p>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
