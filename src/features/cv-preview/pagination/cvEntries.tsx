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
  type LucideIcon,
} from "lucide-react";
import type { Cv, SectionKey } from "@/types/cv.types";
import type { Entry } from "./types";
import { formatDateRange } from "@/utils/date";
import { getInitials } from "@/utils/text";

// Palette « papier » fixe (indépendante du thème clair/sombre de l'application).
const INK = "#1F2937";
const SUB = "#6B7280";
const BORDER = "#E5E7EB";
const BG2 = "#F8FAFC";

const SECTION_META: Record<SectionKey, { icon: LucideIcon; label: string }> = {
  experiences: { icon: Briefcase, label: "Expériences professionnelles" },
  skillsTable: { icon: Wrench, label: "Compétences techniques" },
  hardSkills: { icon: Star, label: "Hard Skills" },
  softSkills: { icon: Users, label: "Soft Skills" },
  education: { icon: GraduationCap, label: "Parcours académique" },
  languages: { icon: LanguagesIcon, label: "Langues" },
};

function SectionHeader({ icon: Icon, label, primary }: { icon: LucideIcon; label: string; primary: string }) {
  return (
    <div className="flex items-center gap-2 pt-3" style={{ borderTop: `1px solid ${BORDER}` }}>
      <Icon size={15} style={{ color: primary }} />
      <h2 className="text-[12px] font-bold uppercase tracking-wider" style={{ color: INK }}>
        {label}
      </h2>
    </div>
  );
}

/** Construit la liste ordonnée des blocs paginables d'un CV, stylés pour un rendu papier fidèle à l'export PDF. */
export function buildCvEntries(cv: Cv): Entry[] {
  const { personalInfo, experiences, skillsTable, hardSkills, softSkills, education, languages, customization } = cv;
  const primary = customization.primaryColor || "#2563EB";
  const entries: Entry[] = [];

  // — En-tête / informations personnelles —
  entries.push({
    type: "atom",
    id: "personal",
    sectionId: "personal",
    keepWithNext: false,
    render: () => (
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-[26px] font-bold leading-tight" style={{ color: INK }}>
            {personalInfo.fullName || "Nom Prénom"}
          </h1>
          <p className="mt-0.5 text-[12px] font-bold uppercase tracking-wide" style={{ color: primary }}>
            {personalInfo.title || "Titre professionnel"}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]" style={{ color: SUB }}>
            {personalInfo.address && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={12} style={{ color: primary }} /> {personalInfo.address}
              </span>
            )}
            {personalInfo.email && (
              <span className="inline-flex items-center gap-1">
                <Mail size={12} style={{ color: primary }} /> {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="inline-flex items-center gap-1">
                <Phone size={12} style={{ color: primary }} /> {personalInfo.phone}
              </span>
            )}
          </div>
          {personalInfo.yearsOfExperience > 0 && (
            <div className="mt-1 flex items-center gap-1 text-[11px]" style={{ color: SUB }}>
              <Calendar size={12} style={{ color: primary }} /> {personalInfo.yearsOfExperience} ans d&apos;expérience
            </div>
          )}
        </div>
        <div
          className="flex size-[72px] shrink-0 items-center justify-center overflow-hidden rounded-xl text-[15px] font-bold"
          style={{ border: `1px solid ${BORDER}`, background: BG2, color: SUB }}
        >
          {personalInfo.photoUrl ? (
            <img src={personalInfo.photoUrl} alt={personalInfo.fullName} className="size-full object-cover" />
          ) : (
            getInitials(personalInfo.fullName || "?")
          )}
        </div>
      </div>
    ),
  });

  const visible = customization.sectionOrder.filter((key) => !customization.hiddenSections.includes(key));

  for (const key of visible) {
    const meta = SECTION_META[key];

    if (key === "experiences") {
      if (experiences.length === 0) continue;
      entries.push(sectionHeaderEntry(key, meta, primary));
      for (const exp of experiences) {
        entries.push({
          type: "atom",
          id: exp.id,
          sectionId: key,
          keepWithNext: false,
          render: () => (
            <div className="py-0.5 pl-4" style={{ borderLeft: `3px solid ${primary}` }}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[13px] font-bold" style={{ color: INK }}>
                  {exp.position}
                </h3>
                <span className="shrink-0 text-[11px]" style={{ color: SUB }}>
                  {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[12px] font-medium" style={{ color: primary }}>
                  {exp.company}
                </span>
                <span className="shrink-0 text-[11px]" style={{ color: SUB }}>
                  {[exp.city, exp.country].filter(Boolean).join(", ")}
                </span>
              </div>
              {exp.missions.length > 0 && (
                <div className="mt-1.5 space-y-1 text-[11.5px] leading-[1.45]" style={{ color: SUB }}>
                  {/* Puce en texte inline + retrait négatif : baseline identique navigateur / export rasterisé. */}
                  {exp.missions.map((m) => (
                    <p key={m.id} style={{ paddingLeft: "0.85em", textIndent: "-0.85em" }}>
                      <span style={{ color: primary }}>•</span> {m.text}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ),
        });
      }
      continue;
    }

    if (key === "skillsTable") {
      if (skillsTable.length === 0) continue;
      entries.push(sectionHeaderEntry(key, meta, primary));
      for (const row of skillsTable) {
        entries.push({
          type: "atom",
          id: row.id,
          sectionId: key,
          keepWithNext: false,
          render: () => (
            <div
              className="grid grid-cols-[170px_1fr] overflow-hidden rounded-md"
              style={{ border: `1px solid ${BORDER}` }}
            >
              <div className="px-3 py-2 text-[12px] font-medium" style={{ color: INK, background: BG2 }}>
                {row.category}
              </div>
              <div className="px-3 py-2 text-[12px]" style={{ color: SUB }}>
                {row.technologies.join(", ")}
              </div>
            </div>
          ),
        });
      }
      continue;
    }

    if (key === "hardSkills" || key === "softSkills") {
      const badges = key === "hardSkills" ? hardSkills : softSkills;
      if (badges.length === 0) continue;
      entries.push(sectionHeaderEntry(key, meta, primary));
      entries.push({
        type: "badges",
        groupId: key,
        sectionId: key,
        badges: badges.map((b) => ({
          id: b.id,
          // Flex + hauteur explicite : html2canvas centre le texte par la boîte (et non par la baseline).
          render: () =>
            key === "hardSkills" ? (
              <span
                className="inline-flex h-[24px] items-center rounded-full px-3 text-[11px] font-medium leading-none text-white"
                style={{ background: primary }}
              >
                {b.label}
              </span>
            ) : (
              <span
                className="inline-flex h-[24px] items-center rounded-full px-3 text-[11px] font-medium leading-none"
                style={{ background: BG2, color: INK, border: `1px solid ${BORDER}` }}
              >
                {b.label}
              </span>
            ),
        })),
      });
      continue;
    }

    if (key === "education") {
      if (education.length === 0) continue;
      entries.push(sectionHeaderEntry(key, meta, primary));
      for (const item of education) {
        entries.push({
          type: "atom",
          id: item.id,
          sectionId: key,
          keepWithNext: false,
          render: () => (
            <div className="rounded-md px-4 py-2.5" style={{ border: `1px solid ${BORDER}`, background: BG2 }}>
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="text-[12.5px] font-bold" style={{ color: INK }}>
                  {item.degree}
                  {item.field ? ` en ${item.field}` : ""}
                </h4>
                <span className="shrink-0 text-[11px]" style={{ color: SUB }}>
                  {item.graduationDate}
                </span>
              </div>
              <p className="mt-0.5 text-[11px]" style={{ color: SUB }}>
                {[item.institution, item.city].filter(Boolean).join(", ")}
              </p>
            </div>
          ),
        });
      }
      continue;
    }

    if (key === "languages") {
      if (languages.length === 0) continue;
      entries.push(sectionHeaderEntry(key, meta, primary));
      for (const lang of languages) {
        entries.push({
          type: "atom",
          id: lang.id,
          sectionId: key,
          keepWithNext: false,
          render: () => (
            <div>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-[12px] font-medium" style={{ color: INK }}>
                  {lang.name}
                </span>
                <span className="text-[11px] italic" style={{ color: SUB }}>
                  {lang.level}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full" style={{ background: BORDER }}>
                <div className="h-full rounded-full" style={{ width: `${lang.proficiency}%`, background: primary }} />
              </div>
            </div>
          ),
        });
      }
      continue;
    }
  }

  return entries;
}

function sectionHeaderEntry(
  key: SectionKey,
  meta: { icon: LucideIcon; label: string },
  primary: string,
): Entry {
  return {
    type: "atom",
    id: `header-${key}`,
    sectionId: key,
    keepWithNext: true,
    render: () => <SectionHeader icon={meta.icon} label={meta.label} primary={primary} />,
  };
}
