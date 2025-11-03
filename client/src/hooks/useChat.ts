import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

interface Message {
  id: string;
  conversationId: string;
  senderType: string;
  senderId: string;
  text: string;
  read: boolean;
  createdAt: Date;
}

export function useChat(userId: string | undefined) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io({
      path: "/socket.io",
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      newSocket.emit("chat:join", { userId });
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("chat:history", (data: { messages: Message[] }) => {
      setMessages(data.messages);
      if (data.messages.length > 0) {
        setConversationId(data.messages[0].conversationId);
      }
    });

    newSocket.on("chat:new_message", (data: { message: Message }) => {
      setMessages((prev) => [...prev, data.message]);
    });

    newSocket.on("chat:user_typing", () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userId]);

  const sendMessage = (text: string) => {
    if (!socket || !conversationId || !userId) return;
    socket.emit("chat:message", { userId, text, conversationId });
  };

  const sendTyping = () => {
    if (!socket || !conversationId) return;
    socket.emit("chat:typing", { conversationId });
  };

  return {
    messages,
    sendMessage,
    sendTyping,
    isTyping,
    isConnected,
  };
}
