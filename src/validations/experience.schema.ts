import { z } from "zod";

export const missionSchema = z.object({
  id: z.string(),
  text: z.string().trim().min(1, "La mission ne peut pas être vide."),
});

export const experienceSchema = z
  .object({
    id: z.string(),
    position: z.string().trim().min(2, "Le poste est requis."),
    company: z.string().trim().min(1, "L'entreprise est requise."),
    city: z.string().trim().min(1, "La ville est requise."),
    country: z.string().trim().min(1, "Le pays est requis."),
    startDate: z.string().trim().min(1, "La date de début est requise."),
    endDate: z.string().trim(),
    current: z.boolean(),
    missions: z.array(missionSchema),
  })
  .refine((exp) => exp.current || exp.endDate.length > 0, {
    message: "La date de fin est requise si l'expérience n'est pas en cours.",
    path: ["endDate"],
  });

export type ExperienceFormValues = z.infer<typeof experienceSchema>;
