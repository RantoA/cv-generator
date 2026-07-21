import { forwardRef } from "react";
import type { Cv } from "@/types/cv.types";
import { PaginatedCv } from "../pagination/PaginatedCv";
import { useFitScale } from "../hooks/useFitScale";
import { useElementHeight } from "../hooks/useElementHeight";
import { A4_WIDTH_PX } from "@/utils/page";
import { cn } from "@/lib/utils";

interface PreviewFrameProps {
  cv: Cv;
  className?: string;
}

/**
 * Aperçu paginé : le CV est rendu en pages A4 réelles, mises à l'échelle pour tenir dans le conteneur.
 * `ref` pointe le conteneur des pages (utilisé pour l'export PDF depuis l'aperçu).
 */
export const PreviewFrame = forwardRef<HTMLDivElement, PreviewFrameProps>(({ cv, className }, ref) => {
  const { containerRef, scale } = useFitScale<HTMLDivElement>();
  const { ref: contentRef, height } = useElementHeight<HTMLDivElement>();

  return (
    <div
      ref={containerRef}
      className={cn("mx-auto overflow-hidden", className)}
      style={{ width: "100%", maxWidth: A4_WIDTH_PX }}
    >
      <div style={{ height: height * scale || undefined }}>
        <div style={{ width: A4_WIDTH_PX, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <div ref={contentRef}>
            <PaginatedCv ref={ref} cv={cv} />
          </div>
        </div>
      </div>
    </div>
  );
});
PreviewFrame.displayName = "PreviewFrame";
