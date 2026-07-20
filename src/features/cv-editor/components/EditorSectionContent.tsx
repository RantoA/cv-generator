import { Star, Users } from "lucide-react";
import { SECTION_LABELS } from "@/types/cv.types";
import type { EditorSectionId } from "../editor.types";
import { PersonalInfoSection } from "../sections/PersonalInfoSection";
import { ExperienceSection } from "../sections/ExperienceSection";
import { SkillsTableSection } from "../sections/SkillsTableSection";
import { BadgeListSection } from "../sections/BadgeListSection";
import { EducationSection } from "../sections/EducationSection";
import { LanguageSection } from "../sections/LanguageSection";
import { CustomizationSection } from "../sections/CustomizationSection";

export function EditorSectionContent({ section }: { section: EditorSectionId }) {
  switch (section) {
    case "personalInfo":
      return <SectionCard title="Informations personnelles"><PersonalInfoSection /></SectionCard>;
    case "experiences":
      return <SectionCard title={SECTION_LABELS.experiences}><ExperienceSection /></SectionCard>;
    case "skillsTable":
      return <SectionCard title={SECTION_LABELS.skillsTable}><SkillsTableSection /></SectionCard>;
    case "hardSkills":
      return (
        <SectionCard title={SECTION_LABELS.hardSkills}>
          <BadgeListSection
            sectionKey="hardSkills"
            icon={Star}
            emptyLabel="Aucun hard skill"
            emptyDescription="Ajoutez vos compétences techniques clés."
            addLabel="Ajouter"
          />
        </SectionCard>
      );
    case "softSkills":
      return (
        <SectionCard title={SECTION_LABELS.softSkills}>
          <BadgeListSection
            sectionKey="softSkills"
            icon={Users}
            emptyLabel="Aucun soft skill"
            emptyDescription="Ajoutez vos qualités humaines et comportementales."
            addLabel="Ajouter"
          />
        </SectionCard>
      );
    case "education":
      return <SectionCard title={SECTION_LABELS.education}><EducationSection /></SectionCard>;
    case "languages":
      return <SectionCard title={SECTION_LABELS.languages}><LanguageSection /></SectionCard>;
    case "customization":
      return <SectionCard title="Personnalisation"><CustomizationSection /></SectionCard>;
    default:
      return null;
  }
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-in rounded-xl border border-border bg-card p-5 shadow-subtle sm:p-6">
      <h2 className="mb-5 text-base font-semibold text-foreground">{title}</h2>
      {children}
    </div>
  );
}
