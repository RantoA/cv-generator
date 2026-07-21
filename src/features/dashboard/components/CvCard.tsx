import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, Copy, Eye, MoreVertical, Pencil, Star, Trash2, Download } from "lucide-react";
import type { Cv } from "@/types/cv.types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { countSkills } from "../hooks/useCvListPage";
import { formatDate } from "@/utils/date";

interface CvCardProps {
  cv: Cv;
  onDuplicate: (cv: Cv) => void;
  onDelete: (cv: Cv) => void;
  onExportPdf: (cv: Cv) => void;
}

export function CvCard({ cv, onDuplicate, onDelete, onExportPdf }: CvCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-subtle transition-shadow hover:shadow-card"
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => navigate(`/cv/${cv.id}/edit`)}
          className="min-w-0 flex-1 text-left"
        >
          <p className="truncate text-base font-semibold text-foreground">{cv.meta.name}</p>
          <p className="truncate text-sm text-foreground-secondary">
            {cv.personalInfo.fullName || "Candidat sans nom"}
          </p>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0" aria-label="Actions du CV">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/cv/${cv.id}/edit`)}>
              <Pencil /> Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => window.open(`/cv/${cv.id}/preview`, "_blank", "noopener,noreferrer")}
            >
              <Eye /> Aperçu
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(cv)}>
              <Copy /> Dupliquer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExportPdf(cv)}>
              <Download /> Exporter PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onClick={() => onDelete(cv)}>
              <Trash2 /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="capitalize">
          {cv.customization.template === "classic" ? "Classique" : "Modern"}
        </Badge>
      </div>

      <div className="flex items-center gap-4 text-sm text-foreground-secondary">
        <span className="inline-flex items-center gap-1.5">
          <Briefcase className="size-3.5 text-primary" />
          {cv.experiences.length} expérience{cv.experiences.length > 1 ? "s" : ""}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Star className="size-3.5 text-primary" />
          {countSkills(cv)} compétence{countSkills(cv) > 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-foreground-secondary">
        <span>Créé le {formatDate(cv.meta.createdAt)}</span>
        <span>Modifié le {formatDate(cv.meta.updatedAt)}</span>
      </div>
    </motion.div>
  );
}
