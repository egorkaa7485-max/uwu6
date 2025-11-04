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
    <div className="cases min-h-screen bg-background text-foreground pb-20">
      <Header title="Кейсы" />
      
      <div className="cases__container p-4 max-w-md mx-auto">
        {isLoading ? (
          <div className="cases__loading text-center py-12 text-muted-foreground">Загрузка...</div>
        ) : (
          <div className="cases__grid grid grid-cols-2 gap-3">
            {data?.map((caseItem: any, index: number) => (
              <motion.div
                key={caseItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="cases__card bg-card border-border cursor-pointer hover:border-lime transition-colors overflow-hidden"
                  onClick={() => setLocation(`/cases/${caseItem.id}`)}
                  data-testid={`card-case-${caseItem.id}`}
                >
                  <div className="cases__media aspect-square relative">
                    <img
                      className="cases__image absolute inset-0 w-full h-full object-cover"
                      alt={caseItem.name}
                      src="/figmaAssets/mask-group-1.png"
                    />
                    <div className="cases__overlay absolute inset-0 bg-gradient-to-br from-black/0 to-black/40" />
                  </div>
                  <div className="cases__info p-3">
                    <h3 className="cases__title font-semibold text-sm mb-1">{caseItem.name}</h3>
                    <div className="cases__meta flex items-center justify-between">
                      <span className="cases__price text-lime font-bold">{caseItem.price} ⭐</span>
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
