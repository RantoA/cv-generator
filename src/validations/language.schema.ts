import { z } from "zod";

export const LANGUAGE_LEVELS = [
  "Débutant",
  "Intermédiaire",
  "Professionnel (C1)",
  "Courant",
  "Langue maternelle",
] as const;

export const languageSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(2, "Le nom de la langue est requis."),
  level: z.string().trim().min(1, "Le niveau est requis."),
  proficiency: z.coerce.number().min(0).max(100),
});

export type LanguageFormValues = z.infer<typeof languageSchema>;
