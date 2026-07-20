import { nanoid } from "nanoid";

export function createBlankCv(name = "Nouveau CV") {
  const now = new Date().toISOString();
  return {
    id: nanoid(),
    meta: { name, createdAt: now, updatedAt: now },
    personalInfo: {
      fullName: "",
      title: "",
      phone: "",
      email: "",
      address: "",
      yearsOfExperience: 0,
      photoUrl: "",
    },
    experiences: [],
    skillsTable: [],
    hardSkills: [],
    softSkills: [],
    education: [],
    languages: [],
    customization: {
      template: "modern",
      primaryColor: "#2563EB",
      fontFamily: "Inter",
      sectionOrder: [
        "experiences",
        "skillsTable",
        "hardSkills",
        "softSkills",
        "education",
        "languages",
      ],
      hiddenSections: [],
    },
  };
}
