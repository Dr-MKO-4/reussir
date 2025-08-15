import React from "react";
import styles from "./ChatHeader.module.css";

const ChatHeader: React.FC = () => (
  <header className={styles.header}>
    <div className={styles.info}>
      <span className={styles.botName}>Réussir</span>
      <span className={styles.status}>En ligne • Réponse &lt; 1s</span>
    </div>
    <button className={styles.infoBtn}>Info sujet</button>
  </header>
);

export default ChatHeader;
