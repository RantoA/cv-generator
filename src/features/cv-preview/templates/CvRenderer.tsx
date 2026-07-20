import { forwardRef } from "react";
import type { Cv } from "@/types/cv.types";
import { ModernTemplate } from "./ModernTemplate";
import { ClassicTemplate } from "./ClassicTemplate";

export const CvRenderer = forwardRef<HTMLDivElement, { cv: Cv }>(({ cv }, ref) => {
  return (
    <div ref={ref}>
      {cv.customization.template === "classic" ? <ClassicTemplate cv={cv} /> : <ModernTemplate cv={cv} />}
    </div>
  );
});
CvRenderer.displayName = "CvRenderer";

export const CV_TEMPLATES: { value: Cv["customization"]["template"]; label: string; description: string }[] = [
  { value: "modern", label: "Modern", description: "Mise en page dynamique avec chronologie et badges colorés." },
  { value: "classic", label: "Classique", description: "Présentation sobre et compacte, idéale pour l'impression." },
];
