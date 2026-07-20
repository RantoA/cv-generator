import { Router } from "express";
import { nanoid } from "nanoid";
import { readDb, writeDb } from "../store/fileStore.js";
import { createBlankCv } from "../store/defaults.js";

export const cvsRouter = Router();

cvsRouter.get("/", async (_req, res) => {
  const db = await readDb();
  res.json(db.cvs);
});

cvsRouter.get("/:id", async (req, res) => {
  const db = await readDb();
  const cv = db.cvs.find((c) => c.id === req.params.id);
  if (!cv) return res.status(404).json({ error: "CV introuvable" });
  res.json(cv);
});

cvsRouter.post("/", async (req, res) => {
  const name = typeof req.body?.name === "string" && req.body.name.trim() ? req.body.name.trim() : "Nouveau CV";
  const cv = createBlankCv(name);
  const db = await readDb();
  db.cvs.push(cv);
  await writeDb(db);
  res.status(201).json(cv);
});

cvsRouter.put("/:id", async (req, res) => {
  const db = await readDb();
  const index = db.cvs.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "CV introuvable" });

  const incoming = req.body;
  if (!incoming || typeof incoming !== "object") {
    return res.status(400).json({ error: "Corps de requête invalide" });
  }

  const updated = {
    ...db.cvs[index],
    ...incoming,
    id: db.cvs[index].id,
    meta: {
      ...db.cvs[index].meta,
      ...incoming.meta,
      createdAt: db.cvs[index].meta.createdAt,
      updatedAt: new Date().toISOString(),
    },
  };
  db.cvs[index] = updated;
  await writeDb(db);
  res.json(updated);
});

cvsRouter.delete("/:id", async (req, res) => {
  const db = await readDb();
  const exists = db.cvs.some((c) => c.id === req.params.id);
  if (!exists) return res.status(404).json({ error: "CV introuvable" });
  db.cvs = db.cvs.filter((c) => c.id !== req.params.id);
  await writeDb(db);
  res.status(204).end();
});

cvsRouter.post("/:id/duplicate", async (req, res) => {
  const db = await readDb();
  const source = db.cvs.find((c) => c.id === req.params.id);
  if (!source) return res.status(404).json({ error: "CV introuvable" });

  const now = new Date().toISOString();
  const duplicate = {
    ...structuredClone(source),
    id: nanoid(),
    meta: {
      name: `${source.meta.name} (Copie)`,
      createdAt: now,
      updatedAt: now,
    },
  };
  db.cvs.push(duplicate);
  await writeDb(db);
  res.status(201).json(duplicate);
});
