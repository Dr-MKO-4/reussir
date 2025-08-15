import React, { useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { Dropdown, Button } from "react-bootstrap";
import { FiPlus, FiSend, FiImage } from "react-icons/fi";
import { PiSigmaBold } from "react-icons/pi";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Composer.module.css"; // Importer le fichier CSS module

interface Props {
  onSend: (text: string) => void;
}

const Composer: React.FC<Props> = ({ onSend }) => {
  const [value, setValue] = useState("");
  const [mathMode, setMathMode] = useState(false);

  const handleSend = () => {
    if (value.trim()) {
      onSend(value);
      setValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="d-flex align-items-center p-2 border rounded" style={{ gap: "8px" }}>
      {/* Bouton + avec menu */}
      <Dropdown>
        <Dropdown.Toggle variant="light" id="dropdown-basic" className="p-2 border-0">
          <FiPlus size={20} />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => alert("Ajouter image")}>
            <FiImage size={16} style={{ marginRight: 6 }} /> Ajouter une image
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setMathMode(m => !m)}>
            <PiSigmaBold size={16} style={{ marginRight: 6 }} /> Mode mathématique
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Zone de saisie */}
      <textarea
        className={styles.textarea}
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Pose ta question ou colle une équation"
        rows={2}
        style={{ resize: "vertical", minHeight: "30px", maxHeight: "180px", lineHeight: "1.5" }}
      />

      {/* Bouton envoyer */}
      <Button
        variant="primary"
        className="p-2"
        disabled={!value.trim()}
        onClick={handleSend}
      >
        <FiSend size={20} />
      </Button>

      {mathMode && (
        <div className="ms-2 text-muted small">
          Éditeur Math activé
        </div>
      )}
    </div>
  );
};

export default Composer;
