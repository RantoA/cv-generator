import { generateId } from "./id";
import type { Experience, Mission, EducationItem, LanguageItem, SkillCategoryRow, SkillBadge } from "@/types/cv.types";

export function createMission(): Mission {
  return { id: generateId("mission"), text: "" };
}

export function createExperience(): Experience {
  return {
    id: generateId("exp"),
    position: "",
    company: "",
    city: "",
    country: "",
    startDate: "",
    endDate: "",
    current: false,
    missions: [],
  };
}

export function createEducation(): EducationItem {
  return { id: generateId("edu"), institution: "", city: "", degree: "", field: "", graduationDate: "" };
}

export function createLanguage(): LanguageItem {
  return { id: generateId("lang"), name: "", level: "Intermédiaire", proficiency: 50 };
}

export function createSkillRow(): SkillCategoryRow {
  return { id: generateId("skill"), category: "", technologies: [] };
}

export function createBadge(): SkillBadge {
  return { id: generateId("badge"), label: "" };
}
