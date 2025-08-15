import React from "react";
import styles from "./ContextPanel.module.css";

const suggestions = [
  "Comment résoudre une équation du second degré ?",
  "Expliquer le théorème de Pythagore.",
];

const ContextPanel: React.FC = () => (
  <div className={styles.panel}>
    <h2 className={styles.title}>Suggestions</h2>
    <ul className={styles.suggestions}>
      {suggestions.map((s, i) => (
        <li key={i} className={styles.suggestion}>{s}</li>
      ))}
    </ul>
    <div className={styles.cards}>
      {/* Fiches liées, à compléter selon besoin */}
      <div className={styles.card}>Fiche 1</div>
      <div className={styles.card}>Fiche 2</div>
    </div>
  </div>
);

export default ContextPanel;
