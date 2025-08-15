import React, { useRef, useState } from "react";
import styles from "./ImageUploader.module.css";

const ImageUploader: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.uploader}>
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={inputRef}
        onChange={handleFileChange}
      />
      <button type="button" onClick={() => inputRef.current?.click()} className={styles.uploadBtn}>
        Ajouter une image
      </button>
      {image && (
        <div className={styles.preview}>
          <img src={image} alt="preview" className={styles.img} />
          <div className={styles.actions}>
            <button>Recadrer</button>
            <button>Annoter</button>
            <button onClick={() => setImage(null)}>Supprimer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
