import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Download, X } from "lucide-react";
import type { Cv } from "@/types/cv.types";
import { PreviewFrame } from "./PreviewFrame";
import { Button } from "@/shared/components/ui/button";
import { usePdfExport } from "../hooks/usePdfExport";

interface FullscreenPreviewProps {
  cv: Cv;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FullscreenPreview({ cv, open, onOpenChange }: FullscreenPreviewProps) {
  const { nodeRef, exportPdf, isExporting } = usePdfExport(cv.meta.name);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background-secondary animate-fade-in" />
        <DialogPrimitive.Content className="fixed inset-0 z-50 flex flex-col outline-none">
          <DialogPrimitive.Title className="sr-only">Aperçu plein écran — {cv.meta.name}</DialogPrimitive.Title>
          <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
            <p className="text-sm font-medium text-foreground-secondary">Aperçu plein écran</p>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={exportPdf} disabled={isExporting}>
                <Download /> {isExporting ? "Export en cours…" : "Télécharger PDF"}
              </Button>
              <DialogPrimitive.Close asChild>
                <Button size="icon" variant="ghost" aria-label="Fermer l'aperçu">
                  <X />
                </Button>
              </DialogPrimitive.Close>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto py-10">
            <PreviewFrame ref={nodeRef} cv={cv} />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
