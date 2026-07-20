import { z } from "zod";

export const personalInfoSchema = z.object({
  fullName: z.string().trim().min(2, "Le nom complet doit contenir au moins 2 caractères."),
  title: z.string().trim().min(2, "Le titre professionnel est requis."),
  phone: z
    .string()
    .trim()
    .min(6, "Le numéro de téléphone est requis.")
    .regex(/^[0-9+()\s.-]+$/, "Format de téléphone invalide."),
  email: z.string().trim().email("Adresse email invalide."),
  address: z.string().trim().min(2, "L'adresse est requise."),
  yearsOfExperience: z.coerce
    .number({ message: "Les années d'expérience doivent être un nombre." })
    .min(0, "Les années d'expérience ne peuvent pas être négatives.")
    .max(70, "Valeur trop élevée."),
  photoUrl: z.string().optional().or(z.literal("")),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
