import React from "react";
import styles from "./TypingIndicator.module.css";

const TypingIndicator: React.FC = () => (
  <div className={styles.typing}>
    bot est en train d’écrire…
    <span className={styles.dots}>
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </span>
  </div>
);

export default TypingIndicator;
