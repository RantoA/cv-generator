import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";

export default function Dashboard() {
  const { data, addCv, deleteCv } = useData();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    addCv(name.trim());
    setName("");
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Mes CV</h1>
          <p className="hint">Tous les CV piochent dans les mêmes données de base.</p>
        </div>
        <Link to="/data" className="btn-outline btn-data">
          <span className="btn-data-icon">⚙</span> Mes données
        </Link>
      </div>

      <form className="cv-create-form" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Nom du CV (ex: CV Développeur Front-end)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">+ Créer un CV</button>
      </form>

      {data.cvs.length === 0 ? (
        <p className="empty">Aucun CV pour l'instant. Crée ton premier CV ci-dessus.</p>
      ) : (
        <div className="cv-grid">
          {data.cvs.map((cv) => (
            <div
              key={cv.id}
              className="cv-tile"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/cv/${cv.id}/edit`)}
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate(`/cv/${cv.id}/edit`);
              }}
            >
              <div className="cv-tile-top">
                <span className="cv-tile-icon">📄</span>
                <button
                  className="cv-tile-delete"
                  title="Supprimer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Supprimer le CV "${cv.name}" ?`)) deleteCv(cv.id);
                  }}
                >
                  ✕
                </button>
              </div>

              <strong className="cv-tile-name">{cv.name}</strong>

              <div className="cv-tile-badges">
                <span className="badge">{cv.experienceIds.length} exp.</span>
                <span className="badge">{cv.educationIds.length} formation(s)</span>
                <span className="badge">{cv.skillIds.length} compétence(s)</span>
                <span className="badge">{(cv.languageIds || []).length} langue(s)</span>
              </div>

              <Link
                to={`/cv/${cv.id}/preview`}
                className="cv-tile-preview"
                onClick={(e) => e.stopPropagation()}
              >
                Aperçu / PDF →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
