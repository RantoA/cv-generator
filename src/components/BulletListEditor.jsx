import { useState } from "react";

export default function BulletListEditor({ bullets, onAdd, onUpdate, onRemove, onMove }) {
  const [draft, setDraft] = useState("");

  function handleAdd(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    onAdd(draft.trim());
    setDraft("");
  }

  return (
    <div className="bullet-editor">
      <ul className="bullet-list">
        {bullets.map((bullet, index) => (
          <li key={index} className="bullet-item">
            <span className="bullet-dot">•</span>
            <input
              type="text"
              value={bullet}
              onChange={(e) => onUpdate(index, e.target.value)}
              placeholder="Décris une réalisation, une tâche…"
            />
            <div className="bullet-actions">
              <button type="button" title="Monter" disabled={index === 0} onClick={() => onMove(index, -1)}>
                ↑
              </button>
              <button
                type="button"
                title="Descendre"
                disabled={index === bullets.length - 1}
                onClick={() => onMove(index, 1)}
              >
                ↓
              </button>
              <button type="button" className="danger" title="Supprimer" onClick={() => onRemove(index)}>
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
      <form className="inline-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Ajouter une phrase (ex: Réduction de 30% du temps de build)"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit">+ Ajouter</button>
      </form>
    </div>
  );
}
