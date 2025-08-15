import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import { processEquation } from "./utils/math";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3001;

// Multer config
const upload = multer({
  dest: path.join(__dirname, "../uploads"),
});

app.use(cors());
app.use(express.json());

app.post(
  "/api/chat/send",
  upload.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const text = (req.body.text as string) || "";
      const file = req.file;
      let type: "text" | "image" | "equation" = "text";
      let equationHtml: string | undefined;

      if (!text && !file) {
        return res.status(400).json({
          received: false,
          error: "Aucun message ou fichier fourni.",
        });
      }

      // Détection équation LaTeX
      if (/\$\$[\s\S]*\$\$/.test(text)) {
        type = "equation";
        try {
          equationHtml = processEquation(text);
        } catch (err) {
          return res.status(400).json({
            received: false,
            error: "Équation LaTeX invalide.",
          });
        }
      } else if (file) {
        type = "image";
      }

      // TODO: Intégration stockage externe (S3/Firebase)

      res.status(200).json({
        received: true,
        type,
        text,
        file: file ? file.filename : undefined,
        equationHtml,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Middleware de gestion des erreurs (typé)
app.use(
  (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({
      received: false,
      error: "Erreur interne du serveur.",
    });
  }
);

app.listen(port, () => {
  console.log(`Chat API running on port ${port}`);
});
