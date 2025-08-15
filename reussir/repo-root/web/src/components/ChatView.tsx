import React, { useEffect, useRef, useCallback } from "react";
import styles from "./ChatView.module.css";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import Composer from "./Composer";
import TypingIndicator from "./TypingIndicator";
import { useChat } from "../hooks/useChat";

const ChatView: React.FC = () => {
  const { messages, isTyping, sendMessage } = useChat();

  // ref pour la zone messages (scroll container)
  const messagesRef = useRef<HTMLDivElement | null>(null);

  // utilitaire scroll-to-bottom (smooth)
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = messagesRef.current;
    if (!el) return;
    // scroll to bottom after layout (let DOM update)
    // use requestAnimationFrame for smoother result
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior });
    });
  }, []);

  // scroll quand le nombre de messages change (nouveau message)
  useEffect(() => {
    // utiliser 'auto' behavior on initial render to avoid jumping
    scrollToBottom(messages.length > 0 ? "smooth" : "auto");
  }, [messages.length, scrollToBottom]);

  // scroll quand isTyping change pour garder l'indicateur visible
  useEffect(() => {
    if (isTyping) {
      scrollToBottom("smooth");
    }
  }, [isTyping, scrollToBottom]);

  return (
    <div className={styles.chatView} role="region" aria-label="Fenêtre de chat">
      <ChatHeader />

      <div
        className={styles.messages}
        ref={messagesRef}
        role="list"
        aria-live="polite"
      >
        {messages.map((msg) => (
          <div key={msg.id} role="listitem">
            {/* on passe des props utiles (avatarUrl, isDelivered si dispo) */}
            <MessageBubble
              {...msg}
              avatarUrl={(msg as any).avatarUrl}
              isDelivered={(msg as any).isDelivered}
            />
          </div>
        ))}

        {isTyping && (
          <div role="status" aria-live="polite">
            <TypingIndicator />
          </div>
        )}
      </div>

      <Composer
        onSend={(text: string) => {
          sendMessage(text);
          // scroll instant to show the new user message (slightly delayed)
          setTimeout(() => scrollToBottom("smooth"), 120);
        }}
      />
    </div>
  );
};

export default ChatView;
