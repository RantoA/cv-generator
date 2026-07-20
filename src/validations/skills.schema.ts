import { z } from "zod";

export const skillCategoryRowSchema = z.object({
  id: z.string(),
  category: z.string().trim().min(1, "La catégorie est requise."),
  technologies: z.array(z.string().trim().min(1)).min(1, "Ajoutez au moins une technologie."),
});

export const skillBadgeSchema = z.object({
  id: z.string(),
  label: z.string().trim().min(1, "Le libellé ne peut pas être vide."),
});

export type SkillCategoryRowFormValues = z.infer<typeof skillCategoryRowSchema>;
export type SkillBadgeFormValues = z.infer<typeof skillBadgeSchema>;
