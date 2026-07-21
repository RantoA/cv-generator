import type { CvTemplate } from "@/types/cv.types";

export const CV_TEMPLATES: { value: CvTemplate; label: string; description: string }[] = [
  { value: "modern", label: "Modern", description: "Mise en page dynamique avec chronologie et badges colorés." },
  { value: "classic", label: "Classique", description: "Présentation sobre et compacte, idéale pour l'impression." },
];
