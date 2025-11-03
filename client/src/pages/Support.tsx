import { useState } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/hooks/useUser";
import { useChat } from "@/hooks/useChat";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";

export default function Support() {
  const [, setLocation] = useLocation();
  const { data: user } = useUser();
  const { messages, sendMessage, isTyping, isConnected } = useChat(user?.id);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Header title="Поддержка" />
      
      <div className="p-4 max-w-md mx-auto w-full">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/profile")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full space-y-3">
        {!isConnected && (
          <div className="text-center text-zinc-400 py-4">Подключение...</div>
        )}
        
        {messages.map((msg: any) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderType === "user" ? "justify-end" : "justify-start"}`}
          >
            <Card className={`max-w-[80%] p-3 ${
              msg.senderType === "user"
                ? "bg-lime-500 text-black"
                : "bg-zinc-800 border-zinc-700"
            }`}>
              <p>{msg.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(msg.createdAt).toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </Card>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <Card className="bg-zinc-800 border-zinc-700 p-3">
              <p className="text-zinc-400">Печатает...</p>
            </Card>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-800 max-w-md mx-auto w-full">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Введите сообщение..."
            className="flex-1 bg-zinc-800 border-zinc-700"
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            className="bg-lime-500 hover:bg-lime-600 text-black"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
