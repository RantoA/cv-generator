import {
  Briefcase,
  Calendar,
  GraduationCap,
  Languages as LanguagesIcon,
  Mail,
  MapPin,
  Phone,
  Star,
  Users,
  Wrench,
} from "lucide-react";
import type { CvTemplateProps } from "./template.types";
import type { SectionKey } from "@/types/cv.types";
import { formatDateRange } from "@/utils/date";
import { getInitials } from "@/utils/text";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Progress } from "@/shared/components/ui/progress";

function SectionTitle({ icon: Icon, children, color }: { icon: typeof Briefcase; children: React.ReactNode; color: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Icon className="size-4" style={{ color }} />
      <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">{children}</h2>
    </div>
  );
}

export function ModernTemplate({ cv }: CvTemplateProps) {
  const { personalInfo, experiences, skillsTable, hardSkills, softSkills, education, languages, customization } = cv;
  const color = customization.primaryColor || "#2563EB";
  const visibleSections = customization.sectionOrder.filter((key) => !customization.hiddenSections.includes(key));

  const sectionRenderers: Partial<Record<SectionKey, () => React.ReactNode>> = {
    experiences: () =>
      experiences.length > 0 && (
        <section key="experiences" id="section-experiences">
          <SectionTitle icon={Briefcase} color={color}>
            Expériences professionnelles
          </SectionTitle>
          <div className="flex flex-col">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="relative flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <span
                    className="mt-1.5 size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: index === 0 ? color : `${color}80` }}
                  />
                  {index < experiences.length - 1 && (
                    <span className="mt-1 w-px flex-1" style={{ backgroundColor: "hsl(var(--border))" }} />
                  )}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                    <h3 className="text-[15px] font-bold text-foreground">{exp.position}</h3>
                    <span className="text-xs text-foreground-secondary">
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <span className="text-sm font-medium" style={{ color }}>
                      {exp.company}
                    </span>
                    <span className="text-xs text-foreground-secondary">
                      {[exp.city, exp.country].filter(Boolean).join(", ")}
                    </span>
                  </div>
                  {exp.missions.length > 0 && (
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {exp.missions.map((mission) => (
                        <li key={mission.id} className="flex gap-2 text-sm text-foreground-secondary">
                          <span className="mt-2 size-1 shrink-0 rounded-full bg-foreground-secondary/60" />
                          <span>{mission.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ),

    skillsTable: () =>
      skillsTable.length > 0 && (
        <section key="skillsTable" id="section-skillsTable">
          <SectionTitle icon={Wrench} color={color}>
            Compétences techniques
          </SectionTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Catégorie</TableHead>
                <TableHead>Technologies</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skillsTable.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-foreground">{row.category}</TableCell>
                  <TableCell className="text-foreground-secondary">{row.technologies.join(", ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      ),

    hardSkills: () =>
      hardSkills.length > 0 && (
        <section key="hardSkills" id="section-hardSkills">
          <SectionTitle icon={Star} color={color}>
            Hard Skills
          </SectionTitle>
          <div className="flex flex-wrap gap-2">
            {hardSkills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-full px-3 py-1 text-xs font-medium text-white"
                style={{ backgroundColor: color }}
              >
                {skill.label}
              </span>
            ))}
          </div>
        </section>
      ),

    softSkills: () =>
      softSkills.length > 0 && (
        <section key="softSkills" id="section-softSkills">
          <SectionTitle icon={Users} color={color}>
            Soft Skills
          </SectionTitle>
          <div className="flex flex-wrap gap-2">
            {softSkills.map((skill) => (
              <span key={skill.id} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                {skill.label}
              </span>
            ))}
          </div>
        </section>
      ),

    education: () =>
      education.length > 0 && (
        <section key="education" id="section-education">
          <SectionTitle icon={GraduationCap} color={color}>
            Parcours académique
          </SectionTitle>
          <div className="flex flex-col gap-2.5">
            {education.map((item) => (
              <div key={item.id} className="rounded-lg border border-border bg-background-secondary/60 px-4 py-3">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-sm font-bold text-foreground">
                    {item.degree}
                    {item.field ? ` en ${item.field}` : ""}
                  </h4>
                  <span className="shrink-0 text-xs text-foreground-secondary">{item.graduationDate}</span>
                </div>
                <p className="mt-0.5 text-xs text-foreground-secondary">
                  {[item.institution, item.city].filter(Boolean).join(", ")}
                </p>
              </div>
            ))}
          </div>
        </section>
      ),

    languages: () =>
      languages.length > 0 && (
        <section key="languages" id="section-languages">
          <SectionTitle icon={LanguagesIcon} color={color}>
            Langues
          </SectionTitle>
          <div className="flex flex-col gap-3">
            {languages.map((lang) => (
              <div key={lang.id}>
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-sm font-medium text-foreground">{lang.name}</span>
                  <span className="text-xs italic text-foreground-secondary">{lang.level}</span>
                </div>
                <Progress value={lang.proficiency} className="[&>div]:bg-[var(--cv-primary)]" style={{ ["--cv-primary" as string]: color }} />
              </div>
            ))}
          </div>
        </section>
      ),
  };

  const pairedSections: SectionKey[][] = [];
  for (let i = 0; i < visibleSections.length; i += 1) {
    const key = visibleSections[i];
    if ((key === "hardSkills" && visibleSections[i + 1] === "softSkills") || (key === "education" && visibleSections[i + 1] === "languages")) {
      pairedSections.push([key, visibleSections[i + 1]]);
      i += 1;
    } else {
      pairedSections.push([key]);
    }
  }

  return (
    <div
      className="rounded-2xl border border-border bg-card p-8 shadow-card sm:p-10"
      style={{ fontFamily: customization.fontFamily || undefined }}
    >
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{personalInfo.fullName || "Nom Prénom"}</h1>
          <p className="mt-1 text-sm font-bold uppercase tracking-wide" style={{ color }}>
            {personalInfo.title || "Titre professionnel"}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-foreground-secondary">
            {personalInfo.address && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" style={{ color }} />
                {personalInfo.address}
              </span>
            )}
            {personalInfo.email && (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3.5" style={{ color }} />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="size-3.5" style={{ color }} />
                {personalInfo.phone}
              </span>
            )}
          </div>
          {personalInfo.yearsOfExperience > 0 && (
            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-foreground-secondary">
              <Calendar className="size-3.5" style={{ color }} />
              {personalInfo.yearsOfExperience} ans d&apos;expérience
            </div>
          )}
        </div>
        <div
          className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background-secondary text-lg font-bold text-foreground-secondary"
          aria-hidden={!personalInfo.photoUrl}
        >
          {personalInfo.photoUrl ? (
            <img src={personalInfo.photoUrl} alt={personalInfo.fullName} className="size-full object-cover" />
          ) : (
            getInitials(personalInfo.fullName || "?")
          )}
        </div>
      </div>

      <div className="my-6 h-px bg-border" />

      <div className="flex flex-col gap-6">
        {pairedSections.map((group) =>
          group.length === 2 ? (
            <div key={group.join("-")} className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {group.map((key) => sectionRenderers[key]?.())}
            </div>
          ) : (
            sectionRenderers[group[0]]?.()
          ),
        )}
      </div>
    </div>
  );
}
