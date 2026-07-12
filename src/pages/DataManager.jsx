import { useState } from "react";
import { useData } from "../context/DataContext.jsx";
import ExperienceCard from "../components/ExperienceCard.jsx";

const TABS = ["Profil", "Expériences", "Formation", "Compétences", "Langues"];

export default function DataManager() {
  const [tab, setTab] = useState(TABS[0]);
  const { data } = useData();

  return (
    <div className="page">
      <h1>Mes données</h1>
      <p className="hint">
        Ces informations sont communes à tous les CV. Chaque CV choisit ensuite quelles expériences,
        formations, compétences et langues afficher.
      </p>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={t === tab ? "tab active" : "tab"} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Profil" && <ProfileTab />}
      {tab === "Expériences" && <ExperiencesTab experiences={data.experiences} />}
      {tab === "Formation" && <EducationTab education={data.education} />}
      {tab === "Compétences" && <SkillsTab skills={data.skills} />}
      {tab === "Langues" && <LanguagesTab languages={data.languages} />}
    </div>
  );
}

function ProfileTab() {
  const { data, setProfile } = useData();
  const p = data.profile;
  return (
    <div className="card">
      <div className="form-grid">
        <label>
          Nom complet
          <input type="text" value={p.fullName} onChange={(e) => setProfile({ fullName: e.target.value })} />
        </label>
        <label>
          Titre / poste recherché
          <input type="text" value={p.title} onChange={(e) => setProfile({ title: e.target.value })} />
        </label>
        <label>
          Email
          <input type="email" value={p.email} onChange={(e) => setProfile({ email: e.target.value })} />
        </label>
        <label>
          Téléphone
          <input type="text" value={p.phone} onChange={(e) => setProfile({ phone: e.target.value })} />
        </label>
        <label className="span-2">
          Adresse
          <input type="text" value={p.address} onChange={(e) => setProfile({ address: e.target.value })} />
        </label>
        <label className="span-2">
          Résumé / accroche
          <textarea rows={4} value={p.summary} onChange={(e) => setProfile({ summary: e.target.value })} />
        </label>
      </div>
    </div>
  );
}

function ExperiencesTab({ experiences }) {
  const { addExperience } = useData();
  return (
    <div>
      <div className="toolbar">
        <button onClick={addExperience}>+ Ajouter une expérience</button>
      </div>
      {experiences.length === 0 && <p className="empty">Aucune expérience pour l'instant.</p>}
      <div className="stack">
        {experiences.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
    </div>
  );
}

function EducationTab({ education }) {
  const { addEducation, updateEducation, deleteEducation } = useData();
  return (
    <div>
      <div className="toolbar">
        <button onClick={addEducation}>+ Ajouter une formation</button>
      </div>
      <div className="table-wrapper">
        {education.length === 0 ? (
          <p className="empty table-empty">Aucune formation pour l'instant.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Diplôme</th>
                <th>École</th>
                <th>Date</th>
                <th>Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {education.map((edu) => (
                <tr key={edu.id}>
                  <td>
                    <input
                      type="text"
                      placeholder="ex: Master Informatique"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                    />
                  </td>
                  <td style={{ width: "90px" }}>
                    <input
                      type="text"
                      placeholder="2021"
                      value={edu.date}
                      onChange={(e) => updateEducation(edu.id, { date: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="ex: Mention Bien"
                      value={edu.description}
                      onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                    />
                  </td>
                  <td className="col-actions">
                    <button
                      className="row-delete"
                      title="Supprimer"
                      onClick={() => {
                        if (confirm("Supprimer cette formation ?")) deleteEducation(edu.id);
                      }}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function SkillsTab({ skills }) {
  const { addSkill, updateSkill, deleteSkill } = useData();
  const [draft, setDraft] = useState("");

  function handleAdd(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    addSkill(draft.trim());
    setDraft("");
  }

  return (
    <div>
      <form className="inline-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Nouvelle compétence (ex: React)"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit">+ Ajouter</button>
      </form>
      {skills.length === 0 ? (
        <p className="empty">Aucune compétence pour l'instant.</p>
      ) : (
        <ul className="chip-list">
          {skills.map((s) => (
            <li key={s.id} className="chip chip-selected">
              <input type="text" value={s.name} onChange={(e) => updateSkill(s.id, { name: e.target.value })} />
              <button className="row-delete" title="Supprimer" onClick={() => deleteSkill(s.id)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LanguagesTab({ languages }) {
  const { addLanguage, updateLanguage, deleteLanguage } = useData();
  const [draft, setDraft] = useState("");

  function handleAdd(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    addLanguage(draft.trim());
    setDraft("");
  }

  return (
    <div>
      <form className="inline-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Nouvelle langue (ex: Anglais)"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit">+ Ajouter</button>
      </form>
      <div className="table-wrapper">
        {languages.length === 0 ? (
          <p className="empty table-empty">Aucune langue pour l'instant.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Langue</th>
                <th>Niveau</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {languages.map((lang) => (
                <tr key={lang.id}>
                  <td>
                    <input
                      type="text"
                      value={lang.name}
                      onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
                    />
                  </td>
                  <td style={{ width: "160px" }}>
                    <input
                      type="text"
                      placeholder="ex: Courant, B2, Natif…"
                      value={lang.level}
                      onChange={(e) => updateLanguage(lang.id, { level: e.target.value })}
                    />
                  </td>
                  <td className="col-actions">
                    <button className="row-delete" title="Supprimer" onClick={() => deleteLanguage(lang.id)}>
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
