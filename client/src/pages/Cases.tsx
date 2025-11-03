import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { casesAPI } from "@/lib/api";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";

export default function Cases() {
  const [, setLocation] = useLocation();
  const { data, isLoading } = useQuery({
    queryKey: ["cases"],
    queryFn: async () => {
      const response = await casesAPI.getAll();
      return response.data.cases;
    },
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <Header title="Кейсы" />
      
      <div className="p-4 max-w-md mx-auto">
        {isLoading ? (
          <div className="text-center py-12 text-zinc-400">Загрузка...</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {data?.map((caseItem: any, index: number) => (
              <motion.div
                key={caseItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-lime-500 transition-colors overflow-hidden"
                  onClick={() => setLocation(`/cases/${caseItem.id}`)}
                >
                  <div className="aspect-square bg-gradient-to-br from-lime-500/20 to-purple-500/20 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                      📦
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1">{caseItem.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lime-500 font-bold">{caseItem.price} ⭐</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
