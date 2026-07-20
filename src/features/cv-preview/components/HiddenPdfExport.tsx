import { useEffect } from "react";
import type { Cv } from "@/types/cv.types";
import { PreviewFrame } from "./PreviewFrame";
import { usePdfExport } from "../hooks/usePdfExport";

interface HiddenPdfExportProps {
  cv: Cv;
  onDone: () => void;
}

/** Rend un CV hors-écran le temps de générer son PDF, puis prévient le parent. */
export function HiddenPdfExport({ cv, onDone }: HiddenPdfExportProps) {
  const { nodeRef, exportPdf } = usePdfExport(cv.meta.name);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      await exportPdf();
      if (!cancelled) onDone();
    }, 50);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed left-0 top-0 -z-50 -translate-x-[9999px] opacity-0" aria-hidden="true">
      <PreviewFrame ref={nodeRef} cv={cv} />
    </div>
  );
}
