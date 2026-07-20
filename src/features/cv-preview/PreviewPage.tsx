import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Maximize2 } from "lucide-react";
import { useCvQuery } from "@/services/queries/useCvQueries";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { FileWarning } from "lucide-react";
import { PreviewFrame } from "./components/PreviewFrame";
import { FullscreenPreview } from "./components/FullscreenPreview";
import { usePdfExport } from "./hooks/usePdfExport";
import { useState } from "react";
import type { SectionKey } from "@/types/cv.types";

const NAV_SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "experiences", label: "Expérience" },
  { key: "education", label: "Formation" },
  { key: "skillsTable", label: "Compétences" },
];

export function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: cv, isLoading, isError } = useCvQuery(id);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const { nodeRef, exportPdf, isExporting } = usePdfExport(cv?.meta.name ?? "cv");

  if (isLoading || !cv) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mx-auto h-[600px] w-full max-w-[820px] rounded-2xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <EmptyState icon={FileWarning} title="CV introuvable" description="Ce CV n'existe pas ou a été supprimé." />
      </div>
    );
  }

  const visibleNavSections = NAV_SECTIONS.filter(
    (item) =>
      !cv.customization.hiddenSections.includes(item.key) &&
      cv.customization.sectionOrder.includes(item.key),
  );

  function scrollToSection(key: SectionKey) {
    document.getElementById(`section-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-background-secondary">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1000px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} aria-label="Retour au tableau de bord">
              <ArrowLeft />
            </Button>
            <span className="truncate text-sm font-bold uppercase tracking-wide text-primary">
              {cv.personalInfo.fullName || cv.meta.name}
            </span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            {visibleNavSections.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => scrollToSection(item.key)}
                className="text-sm font-medium text-foreground-secondary transition-colors hover:text-primary"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={() => setIsFullscreenOpen(true)}>
              <Maximize2 /> Plein écran
            </Button>
            <Button size="sm" onClick={exportPdf} disabled={isExporting}>
              <Download /> {isExporting ? "Export…" : "Télécharger PDF"}
            </Button>
          </div>
        </div>
      </header>

      <main className="py-10">
        <PreviewFrame ref={nodeRef} cv={cv} />
      </main>

      <footer className="border-t border-border py-8 text-center">
        <p className="text-sm font-bold text-primary">{cv.personalInfo.fullName?.toUpperCase()}</p>
        <p className="mt-1 text-xs text-foreground-secondary">
          © {new Date().getFullYear()} Portfolio professionnel — Généré pour impression A4
        </p>
        <p className="mt-1 text-xs text-foreground-secondary">
          <span className="mr-3">Politique de confidentialité</span>
          <span>Conditions d&apos;utilisation</span>
        </p>
      </footer>

      <FullscreenPreview cv={cv} open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen} />
    </div>
  );
}
