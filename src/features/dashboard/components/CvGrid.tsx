import { AnimatePresence } from "framer-motion";
import { FileText } from "lucide-react";
import type { Cv } from "@/types/cv.types";
import { CvCard } from "./CvCard";
import { EmptyState } from "@/shared/components/EmptyState";

interface CvGridProps {
  cvs: Cv[];
  hasAnyCv: boolean;
  onDuplicate: (cv: Cv) => void;
  onDelete: (cv: Cv) => void;
  onExportPdf: (cv: Cv) => void;
}

export function CvGrid({ cvs, hasAnyCv, onDuplicate, onDelete, onExportPdf }: CvGridProps) {
  if (cvs.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title={hasAnyCv ? "Aucun résultat" : "Aucun CV pour le moment"}
        description={
          hasAnyCv
            ? "Essayez d'ajuster votre recherche ou vos filtres."
            : "Créez votre premier CV pour commencer à construire votre portfolio professionnel."
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {cvs.map((cv) => (
          <CvCard key={cv.id} cv={cv} onDuplicate={onDuplicate} onDelete={onDelete} onExportPdf={onExportPdf} />
        ))}
      </AnimatePresence>
    </div>
  );
}
