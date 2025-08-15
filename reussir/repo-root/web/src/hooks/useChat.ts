import { useState } from "react";
import type { Message } from "../services/chatService";
import { sendChatMessage } from "../services/chatApi";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  async function sendMessage(text: string, file?: File) {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString(),
    };
    setMessages((msgs: Message[]) => [...msgs, userMsg]);
    setIsTyping(true);
    try {
      const response = await sendChatMessage({ text, file });
      const botMsg: Message = {
        id: Date.now().toString() + "_bot",
        sender: "bot",
        text: response.text || response.error || "Réponse du bot.",
        time: new Date().toLocaleTimeString(),
        source: response.type === "equation" ? response.equationHtml : undefined,
      };
      setMessages((msgs: Message[]) => [...msgs, botMsg]);
    } catch (err) {
      setMessages((msgs: Message[]) => [...msgs, {
        id: Date.now().toString() + "_err",
        sender: "bot",
        text: "Erreur lors de l'envoi du message.",
        time: new Date().toLocaleTimeString(),
      }]);
    }
    setIsTyping(false);
  }

  return { messages, isTyping, sendMessage };
}
