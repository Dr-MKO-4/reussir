import React, { useState } from "react";
import styles from "./MathEditor.module.css";
// import 'katex/dist/katex.min.css'; // à installer et importer dans le projet
// import { BlockMath } from 'react-katex';

const MathEditor: React.FC = () => {
  const [latex, setLatex] = useState("");

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        <button title="Fraction">a/b</button>
        <button title="Exposant">x^2</button>
        <button title="Racine">√</button>
        {/* autres boutons */}
      </div>
      <div className={styles.body}>
        <textarea
          className={styles.textarea}
          value={latex}
          onChange={e => setLatex(e.target.value)}
          placeholder="Saisis du LaTeX: $$ ... $$"
        />
        <div className={styles.preview}>
          {/* <BlockMath math={latex} /> */}
          <span>Prévisualisation KaTeX ici</span>
        </div>
      </div>
    </div>
  );
};

export default MathEditor;
