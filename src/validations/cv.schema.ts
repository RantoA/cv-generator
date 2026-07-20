import { z } from "zod";
import { personalInfoSchema } from "./personalInfo.schema";
import { experienceSchema } from "./experience.schema";
import { skillCategoryRowSchema, skillBadgeSchema } from "./skills.schema";
import { educationSchema } from "./education.schema";
import { languageSchema } from "./language.schema";

export const sectionKeySchema = z.enum([
  "experiences",
  "skillsTable",
  "hardSkills",
  "softSkills",
  "education",
  "languages",
]);

export const customizationSchema = z.object({
  template: z.enum(["modern", "classic"]),
  primaryColor: z.string().regex(/^#([0-9A-Fa-f]{6})$/, "Couleur hexadécimale invalide."),
  fontFamily: z.string().min(1),
  sectionOrder: z.array(sectionKeySchema),
  hiddenSections: z.array(sectionKeySchema),
});

export const cvNameSchema = z.object({
  name: z.string().trim().min(1, "Le nom du CV est requis."),
});

export const cvSchema = z.object({
  id: z.string(),
  meta: z.object({
    name: z.string().trim().min(1, "Le nom du CV est requis."),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  personalInfo: personalInfoSchema,
  experiences: z.array(experienceSchema),
  skillsTable: z.array(skillCategoryRowSchema),
  hardSkills: z.array(skillBadgeSchema),
  softSkills: z.array(skillBadgeSchema),
  education: z.array(educationSchema),
  languages: z.array(languageSchema),
  customization: customizationSchema,
});

export type CvFormValues = z.infer<typeof cvSchema>;
