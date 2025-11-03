import { useState } from "react";
import { useLocation } from "wouter";
import { useInventory } from "@/hooks/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gamesAPI } from "@/lib/api";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { hapticFeedback } from "@/lib/telegram";

export default function Upgrade() {
  const [, setLocation] = useLocation();
  const { data: inventory } = useInventory();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [targetItem, setTargetItem] = useState<any>(null);
  const [result, setResult] = useState<any>(null);

  const upgrade = useMutation({
    mutationFn: () => gamesAPI.upgrade(selectedItem.itemId, targetItem.id),
    onSuccess: (response) => {
      setResult(response.data);
      hapticFeedback(response.data.success ? "success" : "error");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
    },
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header title="Апгрейд" />
      
      <div className="p-4 max-w-md mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/games")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>

        <div className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 p-4">
            <h3 className="font-semibold mb-3">Выберите предмет для улучшения</h3>
            <div className="grid grid-cols-3 gap-2">
              {inventory?.map((inv: any) => (
                <button
                  key={inv.id}
                  onClick={() => setSelectedItem(inv)}
                  className={`p-3 rounded-lg border ${
                    selectedItem?.id === inv.id 
                      ? "border-lime-500 bg-lime-500/10" 
                      : "border-zinc-700 bg-zinc-800"
                  }`}
                >
                  <div className="text-2xl mb-1">💎</div>
                  <div className="text-xs">{inv.item?.name}</div>
                  <div className="text-xs text-lime-500">{inv.item?.value}⭐</div>
                </button>
              ))}
            </div>
          </Card>

          {selectedItem && (
            <Card className="bg-zinc-900 border-zinc-800 p-4">
              <h3 className="font-semibold mb-3">Выберите целевой предмет</h3>
              <div className="grid grid-cols-3 gap-2">
                {inventory?.filter((i: any) => i.id !== selectedItem.id).map((inv: any) => (
                  <button
                    key={inv.id}
                    onClick={() => setTargetItem(inv.item)}
                    className={`p-3 rounded-lg border ${
                      targetItem?.id === inv.item?.id 
                        ? "border-purple-500 bg-purple-500/10" 
                        : "border-zinc-700 bg-zinc-800"
                    }`}
                  >
                    <div className="text-2xl mb-1">💎</div>
                    <div className="text-xs">{inv.item?.name}</div>
                    <div className="text-xs text-purple-500">{inv.item?.value}⭐</div>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {selectedItem && targetItem && (
            <Button
              onClick={() => upgrade.mutate()}
              disabled={upgrade.isPending}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-6"
            >
              Улучшить предмет
            </Button>
          )}

          {result && (
            <Card className={`border-2 p-6 text-center ${
              result.success ? "border-lime-500 bg-lime-500/10" : "border-red-500 bg-red-500/10"
            }`}>
              <div className="text-4xl mb-2">{result.success ? "🎉" : "💔"}</div>
              <h3 className="text-xl font-bold mb-2">
                {result.success ? "Успех!" : "Неудача"}
              </h3>
              <p className="text-zinc-300">
                Шанс был: {result.chance.toFixed(1)}%
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
