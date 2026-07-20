export interface Mission {
  id: string;
  text: string;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  current: boolean;
  missions: Mission[];
}

export interface SkillCategoryRow {
  id: string;
  category: string;
  technologies: string[];
}

export interface SkillBadge {
  id: string;
  label: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  city: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string;
  proficiency: number;
}

export type SectionKey =
  | "experiences"
  | "skillsTable"
  | "hardSkills"
  | "softSkills"
  | "education"
  | "languages";

export type CvTemplate = "modern" | "classic";

export interface CvCustomization {
  template: CvTemplate;
  primaryColor: string;
  fontFamily: string;
  sectionOrder: SectionKey[];
  hiddenSections: SectionKey[];
}

export interface PersonalInfo {
  fullName: string;
  title: string;
  phone: string;
  email: string;
  address: string;
  yearsOfExperience: number;
  photoUrl?: string;
}

export interface CvMeta {
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cv {
  id: string;
  meta: CvMeta;
  personalInfo: PersonalInfo;
  experiences: Experience[];
  skillsTable: SkillCategoryRow[];
  hardSkills: SkillBadge[];
  softSkills: SkillBadge[];
  education: EducationItem[];
  languages: LanguageItem[];
  customization: CvCustomization;
}

export const SECTION_LABELS: Record<SectionKey, string> = {
  experiences: "Expériences professionnelles",
  skillsTable: "Compétences techniques",
  hardSkills: "Hard Skills",
  softSkills: "Soft Skills",
  education: "Parcours académique",
  languages: "Langues",
};
