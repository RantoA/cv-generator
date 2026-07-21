import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Download, Loader2, Maximize2, Redo2, Undo2 } from "lucide-react";
import { useCvEditorStore } from "@/stores/useCvEditorStore";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { useEditCheckpoint } from "../hooks/useEditCheckpoint";
import type { AutosaveStatus } from "../hooks/useAutosave";
import type { Cv } from "@/types/cv.types";
import { cn } from "@/lib/utils";

interface EditorToolbarProps {
  autosaveStatus: AutosaveStatus;
  onExportPdf: () => void;
  isExporting: boolean;
}

export function EditorToolbar({ autosaveStatus, onExportPdf, isExporting }: EditorToolbarProps) {
  const navigate = useNavigate();
  const draft = useCvEditorStore((s) => s.draft as Cv);
  const updateDraft = useCvEditorStore((s) => s.updateDraft);
  const undo = useCvEditorStore((s) => s.undo);
  const redo = useCvEditorStore((s) => s.redo);
  const canUndo = useCvEditorStore((s) => s.past.length > 0);
  const canRedo = useCvEditorStore((s) => s.future.length > 0);
  const checkpoint = useEditCheckpoint();

  return (
    <div className="sticky top-0 z-30 flex flex-col gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} aria-label="Retour au tableau de bord">
          <ArrowLeft />
        </Button>
        <div {...checkpoint}>
          <Input
            value={draft.meta.name}
            onChange={(e) => updateDraft((cv) => ({ ...cv, meta: { ...cv.meta, name: e.target.value } }))}
            className="h-9 w-48 border-transparent bg-transparent px-2 text-base font-semibold shadow-none hover:border-border focus-visible:border-border sm:w-64"
            aria-label="Nom du CV"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          <Button variant="ghost" size="icon" disabled={!canUndo} onClick={undo} aria-label="Annuler">
            <Undo2 className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled={!canRedo} onClick={redo} aria-label="Rétablir">
            <Redo2 className="size-4" />
          </Button>
        </div>

        <span
          className={cn(
            "hidden items-center gap-1.5 text-xs text-foreground-secondary sm:inline-flex",
            autosaveStatus === "error" && "text-destructive",
          )}
        >
          {autosaveStatus === "saving" && (
            <>
              <Loader2 className="size-3.5 animate-spin" /> Enregistrement…
            </>
          )}
          {autosaveStatus === "saved" && (
            <>
              <Check className="size-3.5 text-primary" /> Enregistré
            </>
          )}
          {autosaveStatus === "error" && "Échec de l'enregistrement"}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(`/cv/${draft.id}/preview`, "_blank", "noopener,noreferrer")}
        >
          <Maximize2 /> Aperçu
        </Button>
        <Button size="sm" onClick={onExportPdf} disabled={isExporting}>
          <Download /> {isExporting ? "Export…" : "Exporter PDF"}
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
}
