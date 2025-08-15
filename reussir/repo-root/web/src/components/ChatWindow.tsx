// src/components/ChatWindow.tsx
import React from "react";
import ConversationPanel from "./ConversationPanel";
import ChatView from "./ChatView";
import ContextPanel from "./ContextPanel";
import styles from "./ChatWindow.module.css";

const ChatWindow: React.FC = () => (
  <div className={styles.chatWindow}>
    <aside className={styles.sidebar}>
      <ConversationPanel />
    </aside>

    <main className={styles.main}>
      <div className={styles.chatCard}>
        <ChatView />
      </div>
    </main>

    <aside className={styles.context}>
      <ContextPanel />
    </aside>
  </div>
);

export default ChatWindow;
