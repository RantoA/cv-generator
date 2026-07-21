import { useCallback, useRef } from "react";
import type { Cv } from "@/types/cv.types";
import { PaginatedCv } from "../pagination/PaginatedCv";
import { usePdfExport } from "../hooks/usePdfExport";

interface HiddenPdfExportProps {
  cv: Cv;
  onDone: () => void;
}

/**
 * Rend le CV paginé à taille A4 réelle (hors écran) puis, dès que la pagination est prête,
 * génère le PDF page par page et prévient le parent. Garantit un export à l'échelle 1:1,
 * indépendant de l'aperçu mis à l'échelle.
 */
export function HiddenPdfExport({ cv, onDone }: HiddenPdfExportProps) {
  const { nodeRef, exportPdf } = usePdfExport(cv.meta.name);
  const startedRef = useRef(false);

  const handleReady = useCallback(
    async (pageCount: number) => {
      if (startedRef.current || pageCount === 0) return;
      startedRef.current = true;
      // Laisse un frame au rendu (polices, images) avant de rasteriser.
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
      await exportPdf();
      onDone();
    },
    [exportPdf, onDone],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 -z-50"
      style={{ transform: "translateX(-100000px)" }}
    >
      <PaginatedCv ref={nodeRef} cv={cv} onReady={handleReady} />
    </div>
  );
}
