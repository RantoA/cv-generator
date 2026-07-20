import { z } from "zod";

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().trim().min(2, "L'établissement est requis."),
  city: z.string().trim().min(1, "La ville est requise."),
  degree: z.string().trim().min(1, "Le diplôme est requis."),
  field: z.string().trim().min(1, "Le parcours est requis."),
  graduationDate: z.string().trim().min(4, "La date d'obtention est requise."),
});

export type EducationFormValues = z.infer<typeof educationSchema>;
