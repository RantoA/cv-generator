import { Link, useNavigate, useParams } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";

function moveItem(list, index, direction) {
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export default function CvEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, updateCv } = useData();
  const cv = data.cvs.find((c) => c.id === id);

  if (!cv) {
    return (
      <div className="page">
        <p className="empty">CV introuvable.</p>
        <Link to="/">Retour</Link>
      </div>
    );
  }

  const selectedExperiences = cv.experienceIds.map((eid) => data.experiences.find((e) => e.id === eid)).filter(Boolean);

  function toggle(listKey, itemId) {
    const current = cv[listKey] || [];
    const next = current.includes(itemId) ? current.filter((x) => x !== itemId) : [...current, itemId];
    updateCv(cv.id, { [listKey]: next });
  }

  function isAllSelected(listKey, allIds) {
    const current = cv[listKey] || [];
    return allIds.length > 0 && allIds.every((id) => current.includes(id));
  }

  function toggleAll(listKey, allIds) {
    updateCv(cv.id, { [listKey]: isAllSelected(listKey, allIds) ? [] : allIds });
  }

  const selectedLanguageIds = cv.languageIds || [];

  return (
    <div className="page">
      <div className="page-header">
        <h1>{cv.name}</h1>
        <div className="page-header-actions">
          <Link to={`/cv/${cv.id}/preview`} className="btn-fill">
            Aperçu / PDF →
          </Link>
          <Link to="/" className="btn-outline">
            ← Retour aux CV
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="form-grid">
          <label>
            Nom du CV (usage interne)
            <input type="text" value={cv.name} onChange={(e) => updateCv(cv.id, { name: e.target.value })} />
          </label>
          <label>
            Titre affiché sur le CV
            <input type="text" value={cv.title} onChange={(e) => updateCv(cv.id, { title: e.target.value })} />
          </label>
          <label className="span-2">
            Expérience
            <textarea rows={3} value={cv.summary} onChange={(e) => updateCv(cv.id, { summary: e.target.value })} />
          </label>
        </div>
      </div>

      <section className="card">
        <div className="section-header">
          <h3>Expériences incluses</h3>
          {data.experiences.length > 0 && (
            <button
              type="button"
              className="select-all-btn"
              onClick={() => toggleAll("experienceIds", data.experiences.map((e) => e.id))}
            >
              {isAllSelected("experienceIds", data.experiences.map((e) => e.id))
                ? "Tout désélectionner"
                : "Tout sélectionner"}
            </button>
          )}
        </div>
        {data.experiences.length === 0 && (
          <p className="empty">
            Aucune expérience définie. <Link to="/data">Ajoutes-en dans Mes données</Link>.
          </p>
        )}
        <ul className="select-list">
          {data.experiences.map((exp) => (
            <li key={exp.id}>
              <label>
                <input
                  type="checkbox"
                  checked={cv.experienceIds.includes(exp.id)}
                  onChange={() => toggle("experienceIds", exp.id)}
                />
                {exp.position || "(sans titre)"} — {exp.company}
              </label>
            </li>
          ))}
        </ul>

        {selectedExperiences.length > 0 && (
          <>
            <h4>Ordre d'affichage</h4>
            <ul className="ordered-list">
              {selectedExperiences.map((exp, index) => (
                <li key={exp.id}>
                  <span>
                    {exp.position} — {exp.company}
                  </span>
                  <div className="bullet-actions">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => updateCv(cv.id, { experienceIds: moveItem(cv.experienceIds, index, -1) })}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={index === selectedExperiences.length - 1}
                      onClick={() => updateCv(cv.id, { experienceIds: moveItem(cv.experienceIds, index, 1) })}
                    >
                      ↓
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="card">
        <div className="section-header">
          <h3>Formations incluses</h3>
          {data.education.length > 0 && (
            <button
              type="button"
              className="select-all-btn"
              onClick={() => toggleAll("educationIds", data.education.map((e) => e.id))}
            >
              {isAllSelected("educationIds", data.education.map((e) => e.id))
                ? "Tout désélectionner"
                : "Tout sélectionner"}
            </button>
          )}
        </div>
        {data.education.length === 0 && (
          <p className="empty">
            Aucune formation définie. <Link to="/data">Ajoutes-en dans Mes données</Link>.
          </p>
        )}
        <ul className="select-list">
          {data.education.map((edu) => (
            <li key={edu.id}>
              <label>
                <input
                  type="checkbox"
                  checked={cv.educationIds.includes(edu.id)}
                  onChange={() => toggle("educationIds", edu.id)}
                />
                {edu.degree || "(sans titre)"} — {edu.school}
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <div className="section-header">
          <h3>Compétences incluses</h3>
          {data.skills.length > 0 && (
            <button
              type="button"
              className="select-all-btn"
              onClick={() => toggleAll("skillIds", data.skills.map((s) => s.id))}
            >
              {isAllSelected("skillIds", data.skills.map((s) => s.id)) ? "Tout désélectionner" : "Tout sélectionner"}
            </button>
          )}
        </div>
        {data.skills.length === 0 && (
          <p className="empty">
            Aucune compétence définie. <Link to="/data">Ajoutes-en dans Mes données</Link>.
          </p>
        )}
        <ul className="chip-list">
          {data.skills.map((skill) => (
            <li key={skill.id} className={cv.skillIds.includes(skill.id) ? "chip chip-selected" : "chip"}>
              <label>
                <input
                  type="checkbox"
                  checked={cv.skillIds.includes(skill.id)}
                  onChange={() => toggle("skillIds", skill.id)}
                />
                {skill.name}
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <div className="section-header">
          <h3>Langues incluses</h3>
          {data.languages.length > 0 && (
            <button
              type="button"
              className="select-all-btn"
              onClick={() => toggleAll("languageIds", data.languages.map((l) => l.id))}
            >
              {isAllSelected("languageIds", data.languages.map((l) => l.id))
                ? "Tout désélectionner"
                : "Tout sélectionner"}
            </button>
          )}
        </div>
        {data.languages.length === 0 && (
          <p className="empty">
            Aucune langue définie. <Link to="/data">Ajoutes-en dans Mes données</Link>.
          </p>
        )}
        <ul className="chip-list">
          {data.languages.map((lang) => (
            <li key={lang.id} className={selectedLanguageIds.includes(lang.id) ? "chip chip-selected" : "chip"}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedLanguageIds.includes(lang.id)}
                  onChange={() => toggle("languageIds", lang.id)}
                />
                {lang.name}
                {lang.level ? ` — ${lang.level}` : ""}
              </label>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
