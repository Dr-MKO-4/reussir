import React from "react";
import styles from "./ConversationPanel.module.css";

const conversations = [
  {
    id: 1,
    avatar: "/avatar1.png",
    title: "Mathématiques",
    lastMessage: "Voici la solution à ton équation.",
    premium: true,
  },
  // ... autres conversations
];

const ConversationPanel: React.FC = () => (
  <div className={styles.panel}>
    <h2 className={styles.title}>Conversations</h2>
    <ul className={styles.list}>
      {conversations.map(conv => (
        <li key={conv.id} className={styles.item}>
          <img src={conv.avatar} alt="" className={styles.avatar} />
          <div className={styles.info}>
            <span className={styles.convTitle}>{conv.title}</span>
            <span className={styles.lastMessage}>{conv.lastMessage}</span>
            {conv.premium && <span className={styles.premium}>Premium</span>}
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default ConversationPanel;
