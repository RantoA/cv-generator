import express from "express";
import cors from "cors";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "..", "data", "data.json");

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/api/data", async (req, res) => {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    res.json(JSON.parse(raw));
  } catch (err) {
    console.error("Erreur de lecture de data.json:", err);
    res.status(500).json({ error: "Impossible de lire les données" });
  }
});

app.put("/api/data", async (req, res) => {
  const data = req.body;
  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Corps de requête invalide" });
  }
  try {
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    res.json({ ok: true });
  } catch (err) {
    console.error("Erreur d'écriture de data.json:", err);
    res.status(500).json({ error: "Impossible d'enregistrer les données" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Serveur CV démarré sur http://localhost:${PORT}`);
});
