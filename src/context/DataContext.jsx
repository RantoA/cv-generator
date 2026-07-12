import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { fetchData, saveData } from "../api/client.js";

const DataContext = createContext(null);

const emptyData = {
  profile: { fullName: "", title: "", email: "", phone: "", address: "", summary: "" },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  cvs: [],
};

export function genId() {
  return crypto.randomUUID();
}

export function DataProvider({ children }) {
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    fetchData()
      .then((d) => setData({ ...emptyData, ...d }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const persist = useCallback((next) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        await saveData(next);
      } catch (err) {
        setError(err.message);
      } finally {
        setSaving(false);
      }
    }, 400);
  }, []);

  const update = useCallback(
    (updater) => {
      setData((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const value = {
    data,
    loading,
    error,
    saving,
    setProfile: (patch) => update((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } })),

    addExperience: () =>
      update((prev) => ({
        ...prev,
        experiences: [
          ...prev.experiences,
          { id: genId(), company: "", position: "", location: "", startDate: "", endDate: "", bullets: [] },
        ],
      })),
    updateExperience: (id, patch) =>
      update((prev) => ({
        ...prev,
        experiences: prev.experiences.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      })),
    deleteExperience: (id) =>
      update((prev) => ({
        ...prev,
        experiences: prev.experiences.filter((e) => e.id !== id),
        cvs: prev.cvs.map((cv) => ({ ...cv, experienceIds: cv.experienceIds.filter((eid) => eid !== id) })),
      })),
    addBullet: (expId, text) =>
      update((prev) => ({
        ...prev,
        experiences: prev.experiences.map((e) =>
          e.id === expId ? { ...e, bullets: [...e.bullets, text] } : e
        ),
      })),
    updateBullet: (expId, index, text) =>
      update((prev) => ({
        ...prev,
        experiences: prev.experiences.map((e) =>
          e.id === expId ? { ...e, bullets: e.bullets.map((b, i) => (i === index ? text : b)) } : e
        ),
      })),
    removeBullet: (expId, index) =>
      update((prev) => ({
        ...prev,
        experiences: prev.experiences.map((e) =>
          e.id === expId ? { ...e, bullets: e.bullets.filter((_, i) => i !== index) } : e
        ),
      })),
    moveBullet: (expId, index, direction) =>
      update((prev) => ({
        ...prev,
        experiences: prev.experiences.map((e) => {
          if (e.id !== expId) return e;
          const bullets = [...e.bullets];
          const target = index + direction;
          if (target < 0 || target >= bullets.length) return e;
          [bullets[index], bullets[target]] = [bullets[target], bullets[index]];
          return { ...e, bullets };
        }),
      })),

    addEducation: () =>
      update((prev) => ({
        ...prev,
        education: [...prev.education, { id: genId(), school: "", degree: "", date: "", description: "" }],
      })),
    updateEducation: (id, patch) =>
      update((prev) => ({
        ...prev,
        education: prev.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      })),
    deleteEducation: (id) =>
      update((prev) => ({
        ...prev,
        education: prev.education.filter((e) => e.id !== id),
        cvs: prev.cvs.map((cv) => ({ ...cv, educationIds: cv.educationIds.filter((eid) => eid !== id) })),
      })),

    addSkill: (name) =>
      update((prev) => ({ ...prev, skills: [...prev.skills, { id: genId(), name: name || "" }] })),
    updateSkill: (id, patch) =>
      update((prev) => ({ ...prev, skills: prev.skills.map((s) => (s.id === id ? { ...s, ...patch } : s)) })),
    deleteSkill: (id) =>
      update((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s.id !== id),
        cvs: prev.cvs.map((cv) => ({ ...cv, skillIds: cv.skillIds.filter((sid) => sid !== id) })),
      })),

    addLanguage: (name) =>
      update((prev) => ({
        ...prev,
        languages: [...prev.languages, { id: genId(), name: name || "", level: "" }],
      })),
    updateLanguage: (id, patch) =>
      update((prev) => ({
        ...prev,
        languages: prev.languages.map((l) => (l.id === id ? { ...l, ...patch } : l)),
      })),
    deleteLanguage: (id) =>
      update((prev) => ({
        ...prev,
        languages: prev.languages.filter((l) => l.id !== id),
        cvs: prev.cvs.map((cv) => ({ ...cv, languageIds: (cv.languageIds || []).filter((lid) => lid !== id) })),
      })),

    addCv: (name) =>
      update((prev) => ({
        ...prev,
        cvs: [
          ...prev.cvs,
          {
            id: genId(),
            name: name || "Nouveau CV",
            title: prev.profile.title,
            summary: prev.profile.summary,
            experienceIds: [],
            educationIds: [],
            skillIds: [],
            languageIds: [],
          },
        ],
      })),
    updateCv: (id, patch) =>
      update((prev) => ({ ...prev, cvs: prev.cvs.map((cv) => (cv.id === id ? { ...cv, ...patch } : cv)) })),
    deleteCv: (id) => update((prev) => ({ ...prev, cvs: prev.cvs.filter((cv) => cv.id !== id) })),
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData doit être utilisé dans un DataProvider");
  return ctx;
}
