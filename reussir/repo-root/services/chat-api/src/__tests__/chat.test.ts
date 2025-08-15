import request from "supertest";
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { processEquation } from "../utils/math";

const app = express();
const upload = multer({ dest: path.join(__dirname, "../../uploads") });
app.use(express.json());
app.post("/api/chat/send", upload.single("file"), async (req, res) => {
  const text = req.body.text || "";
  const file = req.file;
  let type: "text" | "image" | "equation" = "text";
  let equationHtml: string | undefined;
  if (/\$\$[\s\S]*\$\$/.test(text)) {
    type = "equation";
    equationHtml = processEquation(text);
  } else if (file) {
    type = "image";
  }
  res.json({ received: true, type, text, file: file ? file.filename : undefined, equationHtml });
});

describe("Chat API", () => {
  it("envoie un message texte simple", async () => {
    const res = await request(app)
      .post("/api/chat/send")
      .send({ text: "Bonjour" });
    expect(res.body).toMatchObject({ received: true, type: "text", text: "Bonjour" });
  });

  it("envoie une image", async () => {
    const res = await request(app)
      .post("/api/chat/send")
      .attach("file", Buffer.from([1,2,3]), "test.png");
    expect(res.body.type).toBe("image");
    expect(res.body.file).toBeDefined();
  });

  it("envoie une équation LaTeX", async () => {
    const res = await request(app)
      .post("/api/chat/send")
      .send({ text: "$$x^2+1$$" });
    expect(res.body.type).toBe("equation");
    expect(res.body.equationHtml).toContain("katex");
  });
});
