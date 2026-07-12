import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useData } from "../context/DataContext.jsx";
import { IconBriefcase, IconCap, IconGlobe, IconMail, IconPhone, IconPin, IconSliders } from "../components/ResumeIcons.jsx";

export default function CvPreview() {
  const { id } = useParams();
  const { data } = useData();
  const cv = data.cvs.find((c) => c.id === id);
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: cv ? cv.name : "CV",
  });

  if (!cv) {
    return (
      <div className="page">
        <p className="empty">CV introuvable.</p>
        <Link to="/">Retour</Link>
      </div>
    );
  }

  const experiences = cv.experienceIds.map((eid) => data.experiences.find((e) => e.id === eid)).filter(Boolean);
  const education = cv.educationIds.map((eid) => data.education.find((e) => e.id === eid)).filter(Boolean);
  const skills = cv.skillIds.map((sid) => data.skills.find((s) => s.id === sid)).filter(Boolean);
  const languages = (cv.languageIds || []).map((lid) => data.languages.find((l) => l.id === lid)).filter(Boolean);
  const p = data.profile;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Aperçu — {cv.name}</h1>
        <div className="page-header-actions">
          <button onClick={handlePrint}>⬇ Exporter en PDF</button>
          <Link to={`/cv/${cv.id}/edit`} className="btn-outline">
            Modifier
          </Link>
          <Link to="/" className="btn-outline">
            ← Retour aux CV
          </Link>
        </div>
      </div>

      <div className="resume-wrapper">
        <div className="resume" ref={printRef}>
          <header className="resume-header">
            <h1 className="resume-name">{p.fullName || "Ton nom"}</h1>
            <p className="resume-role">{cv.title || p.title}</p>
            {cv.summary && <p className="resume-tagline">{cv.summary}</p>}
            <div className="resume-contact">
              {p.email && (
                <span>
                  <IconMail className="resume-contact-icon" /> {p.email}
                </span>
              )}
              {p.phone && (
                <span>
                  <IconPhone className="resume-contact-icon" /> {p.phone}
                </span>
              )}
              {p.address && (
                <span>
                  <IconPin className="resume-contact-icon" /> {p.address}
                </span>
              )}
            </div>
          </header>

          {experiences.length > 0 && (
            <section className="resume-section">
              <h2>
                <IconBriefcase className="resume-section-icon" /> Expérience
              </h2>
              {experiences.map((exp) => (
                <div key={exp.id} className="resume-item">
                  <div className="resume-item-header">
                    <strong>{exp.position}</strong>
                  </div>
                  <div className="resume-item-subheader">
                    {exp.company}
                    {exp.location ? `  ·  ${exp.location}` : ""}
                  </div>
                  <div className="resume-dates">
                    {exp.startDate} — {exp.endDate}
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul>
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {skills.length > 0 && (
            <section className="resume-section">
              <h2>
                <IconSliders className="resume-section-icon" /> Compétences
              </h2>
              <ul className="resume-skills-grid">
                {skills.map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </section>
          )}

          {education.length > 0 && (
            <section className="resume-section">
              <h2>
                <IconCap className="resume-section-icon" /> Formation
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="resume-item">
                  <div className="resume-item-header">
                    <strong>{edu.degree}</strong>
                  </div>
                  <div className="resume-item-subheader">{edu.school}</div>
                  <div className="resume-dates">{edu.date}</div>
                  {edu.description && <p className="resume-edu-description">{edu.description}</p>}
                </div>
              ))}
            </section>
          )}

          {languages.length > 0 && (
            <section className="resume-section">
              <h2>
                <IconGlobe className="resume-section-icon" /> Langues
              </h2>
              <div className="resume-lang-list">
                {languages.map((l) => (
                  <div key={l.id}>
                    {l.name}
                    {l.level ? ` (${l.level})` : ""}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
