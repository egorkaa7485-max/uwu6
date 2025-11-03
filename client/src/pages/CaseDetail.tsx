import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { casesAPI } from "@/lib/api";
import { hapticFeedback } from "@/lib/telegram";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function CaseDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [isOpening, setIsOpening] = useState(false);
  const [wonItem, setWonItem] = useState<any>(null);

  const { data: caseData } = useQuery({
    queryKey: ["case", id],
    queryFn: async () => {
      const response = await casesAPI.getById(id!);
      return response.data.case;
    },
    enabled: !!id,
  });

  const openCase = useMutation({
    mutationFn: () => casesAPI.open(id!),
    onMutate: () => {
      setIsOpening(true);
      hapticFeedback("medium");
    },
    onSuccess: (response) => {
      setTimeout(() => {
        setWonItem(response.data.item);
        setIsOpening(false);
        hapticFeedback("success");
        queryClient.invalidateQueries({ queryKey: ["balance"] });
        queryClient.invalidateQueries({ queryKey: ["inventory"] });
      }, 2000);
    },
    onError: () => {
      setIsOpening(false);
      hapticFeedback("error");
    },
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />
      
      <div className="p-4 max-w-md mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/cases")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>

        {caseData && (
          <div className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <div className="aspect-square bg-gradient-to-br from-lime-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center text-6xl">
                📦
              </div>
              <h2 className="text-2xl font-bold mb-2">{caseData.name}</h2>
              <p className="text-zinc-400 mb-4">{caseData.description}</p>
              <Button
                onClick={() => openCase.mutate()}
                disabled={isOpening}
                className="w-full bg-lime-500 hover:bg-lime-600 text-black font-bold text-lg py-6"
              >
                {isOpening ? "Открытие..." : `Открыть за ${caseData.price} ⭐`}
              </Button>
            </Card>

            <AnimatePresence>
              {isOpening && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="text-6xl mb-4"
                    >
                      📦
                    </motion.div>
                    <p className="text-xl text-lime-500">Открытие кейса...</p>
                  </div>
                </motion.div>
              )}

              {wonItem && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                  onClick={() => setWonItem(null)}
                >
                  <Card className="bg-zinc-900 border-lime-500 p-6 text-center max-w-sm">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                      className="text-6xl mb-4"
                    >
                      🎉
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">Поздравляем!</h3>
                    <p className="text-xl text-lime-500 mb-4">{wonItem.name}</p>
                    <p className="text-2xl font-bold">{wonItem.value} ⭐</p>
                    <Button
                      onClick={() => setWonItem(null)}
                      className="mt-6 w-full bg-lime-500 hover:bg-lime-600 text-black"
                    >
                      Отлично!
                    </Button>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
