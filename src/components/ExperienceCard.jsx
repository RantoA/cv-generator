import { useData } from "../context/DataContext.jsx";
import BulletListEditor from "./BulletListEditor.jsx";

export default function ExperienceCard({ experience }) {
  const { updateExperience, deleteExperience, addBullet, updateBullet, removeBullet, moveBullet } = useData();

  return (
    <div className="card">
      <div className="card-header">
        <input
          type="text"
          className="title-input"
          placeholder="Poste (ex: Développeur Full-stack)"
          value={experience.position}
          onChange={(e) => updateExperience(experience.id, { position: e.target.value })}
        />
        <button
          className="danger"
          onClick={() => {
            if (confirm("Supprimer cette expérience ?")) deleteExperience(experience.id);
          }}
        >
          Supprimer
        </button>
      </div>

      <div className="form-grid">
        <label>
          Entreprise
          <input
            type="text"
            value={experience.company}
            onChange={(e) => updateExperience(experience.id, { company: e.target.value })}
          />
        </label>
        <label>
          Lieu
          <input
            type="text"
            value={experience.location}
            onChange={(e) => updateExperience(experience.id, { location: e.target.value })}
          />
        </label>
        <label>
          Début
          <input
            type="text"
            placeholder="ex: Jan 2022"
            value={experience.startDate}
            onChange={(e) => updateExperience(experience.id, { startDate: e.target.value })}
          />
        </label>
        <label>
          Fin
          <input
            type="text"
            placeholder="ex: Présent"
            value={experience.endDate}
            onChange={(e) => updateExperience(experience.id, { endDate: e.target.value })}
          />
        </label>
      </div>

      <div className="bullet-section">
        <h4>Réalisations / missions</h4>
        <BulletListEditor
          bullets={experience.bullets}
          onAdd={(text) => addBullet(experience.id, text)}
          onUpdate={(index, text) => updateBullet(experience.id, index, text)}
          onRemove={(index) => removeBullet(experience.id, index)}
          onMove={(index, dir) => moveBullet(experience.id, index, dir)}
        />
      </div>
    </div>
  );
}
