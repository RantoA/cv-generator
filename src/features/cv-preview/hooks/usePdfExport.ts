import { useRef, useState } from "react";
import { toast } from "sonner";
import { exportContainerToPdf } from "../export/exportToPdf";

export function usePdfExport(fileName: string) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  async function exportPdf() {
    if (!nodeRef.current) return;
    setIsExporting(true);
    try {
      await exportContainerToPdf(nodeRef.current, fileName);
      toast.success("PDF téléchargé.");
    } catch {
      toast.error("Échec de l'export PDF.");
    } finally {
      setIsExporting(false);
    }
  }

  return { nodeRef, exportPdf, isExporting };
}
