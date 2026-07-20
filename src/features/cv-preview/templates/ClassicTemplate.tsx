import { Mail, MapPin, Phone } from "lucide-react";
import type { CvTemplateProps } from "./template.types";
import type { SectionKey } from "@/types/cv.types";
import { SECTION_LABELS } from "@/types/cv.types";
import { formatDateRange } from "@/utils/date";

function SectionHeading({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <h2
      className="mb-3 border-b pb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-foreground"
      style={{ borderColor: color }}
    >
      {children}
    </h2>
  );
}

export function ClassicTemplate({ cv }: CvTemplateProps) {
  const { personalInfo, experiences, skillsTable, hardSkills, softSkills, education, languages, customization } = cv;
  const color = customization.primaryColor || "#2563EB";
  const visibleSections = customization.sectionOrder.filter((key) => !customization.hiddenSections.includes(key));

  const sectionRenderers: Partial<Record<SectionKey, () => React.ReactNode>> = {
    experiences: () =>
      experiences.length > 0 && (
        <section key="experiences" id="section-experiences">
          <SectionHeading color={color}>{SECTION_LABELS.experiences}</SectionHeading>
          <div className="flex flex-col gap-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="border-l-2 pl-4" style={{ borderColor: "hsl(var(--border))" }}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-sm font-bold text-foreground">
                    {exp.position} · <span className="font-normal text-foreground-secondary">{exp.company}</span>
                  </h3>
                  <span className="text-xs text-foreground-secondary">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="text-xs text-foreground-secondary">{[exp.city, exp.country].filter(Boolean).join(", ")}</p>
                {exp.missions.length > 0 && (
                  <ul className="mt-1.5 list-disc pl-4 text-sm text-foreground-secondary">
                    {exp.missions.map((mission) => (
                      <li key={mission.id}>{mission.text}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      ),

    skillsTable: () =>
      skillsTable.length > 0 && (
        <section key="skillsTable" id="section-skillsTable">
          <SectionHeading color={color}>{SECTION_LABELS.skillsTable}</SectionHeading>
          <div className="flex flex-col gap-1.5 text-sm">
            {skillsTable.map((row) => (
              <p key={row.id}>
                <span className="font-semibold text-foreground">{row.category} : </span>
                <span className="text-foreground-secondary">{row.technologies.join(", ")}</span>
              </p>
            ))}
          </div>
        </section>
      ),

    hardSkills: () =>
      hardSkills.length > 0 && (
        <section key="hardSkills" id="section-hardSkills">
          <SectionHeading color={color}>{SECTION_LABELS.hardSkills}</SectionHeading>
          <div className="flex flex-wrap gap-1.5">
            {hardSkills.map((skill) => (
              <span key={skill.id} className="rounded border border-border px-2.5 py-1 text-xs font-medium text-foreground">
                {skill.label}
              </span>
            ))}
          </div>
        </section>
      ),

    softSkills: () =>
      softSkills.length > 0 && (
        <section key="softSkills" id="section-softSkills">
          <SectionHeading color={color}>{SECTION_LABELS.softSkills}</SectionHeading>
          <p className="text-sm text-foreground-secondary">{softSkills.map((s) => s.label).join(" · ")}</p>
        </section>
      ),

    education: () =>
      education.length > 0 && (
        <section key="education" id="section-education">
          <SectionHeading color={color}>{SECTION_LABELS.education}</SectionHeading>
          <div className="flex flex-col gap-2 text-sm">
            {education.map((item) => (
              <div key={item.id} className="flex items-baseline justify-between gap-2">
                <span className="text-foreground">
                  <span className="font-semibold">{item.degree}{item.field ? ` en ${item.field}` : ""}</span>
                  {" — "}
                  <span className="text-foreground-secondary">{[item.institution, item.city].filter(Boolean).join(", ")}</span>
                </span>
                <span className="shrink-0 text-xs text-foreground-secondary">{item.graduationDate}</span>
              </div>
            ))}
          </div>
        </section>
      ),

    languages: () =>
      languages.length > 0 && (
        <section key="languages" id="section-languages">
          <SectionHeading color={color}>{SECTION_LABELS.languages}</SectionHeading>
          <p className="text-sm text-foreground-secondary">
            {languages.map((lang) => `${lang.name} (${lang.level})`).join(" · ")}
          </p>
        </section>
      ),
  };

  return (
    <div
      className="rounded-2xl border border-border bg-card p-8 shadow-card sm:p-10"
      style={{ fontFamily: customization.fontFamily || undefined }}
    >
      <div className="border-b pb-5" style={{ borderColor: color }}>
        <h1 className="text-2xl font-bold uppercase tracking-wide text-foreground">
          {personalInfo.fullName || "Nom Prénom"}
        </h1>
        <p className="mt-1 text-sm font-medium text-foreground-secondary">{personalInfo.title || "Titre professionnel"}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground-secondary">
          {personalInfo.address && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" /> {personalInfo.address}
            </span>
          )}
          {personalInfo.email && (
            <span className="inline-flex items-center gap-1">
              <Mail className="size-3" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="inline-flex items-center gap-1">
              <Phone className="size-3" /> {personalInfo.phone}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {visibleSections.map((key) => sectionRenderers[key]?.())}
      </div>
    </div>
  );
}
