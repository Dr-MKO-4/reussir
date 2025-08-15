import React from "react";
import styles from "./MessageBubble.module.css";
import type { Message } from "../services/chatService";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";

interface Props extends Message {}

const MessageBubble: React.FC<Props> = ({ sender, text, time, source, avatarUrl, isDelivered }) => {
  const isUser = sender === "user";

  return (
    <div className={`${styles.messageRow} ${isUser ? styles.mine : styles.theirs}`}>
      {/* Avatar */}
      <div className={styles.avatarWrap} aria-hidden="true">
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className={styles.avatarImg} />
        ) : (
          <div className={styles.avatarFallback}>{isUser ? "U" : "B"}</div>
        )}
      </div>

      {/* Bubble */}
      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.botBubble}`}>
        {source && <div className={styles.source}>Citation: {source}</div>}
        <div className={styles.text}>{text}</div>

        {/* Meta & Feedback */}
        <div className={styles.meta}>
          <span className={styles.time}>{time}</span>
          {!isUser && (
            <span className={styles.feedback}>
              <button
                type="button"
                className={styles.iconBtn}
                aria-label="Utile - oui"
                title="Utile"
                onClick={() => {/* handle upvote */}}
              >
                <FaRegThumbsUp size={18} />
              </button>

              <button
                type="button"
                className={styles.iconBtn}
                aria-label="Utile - non"
                title="Pas utile"
                onClick={() => {/* handle downvote */}}
              >
                <FaRegThumbsDown size={18} />
              </button>
            </span>
          )}
        </div>

        {/* Delivered check for user */}
        {isUser && isDelivered && <span className={styles.delivered}>✓</span>}
      </div>
    </div>
  );
};

export default MessageBubble;
