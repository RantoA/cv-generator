import { forwardRef, useEffect, useMemo } from "react";
import type { Cv } from "@/types/cv.types";
import { buildCvEntries } from "./cvEntries";
import { usePagination } from "./usePagination";
import { Page, PageContent } from "./components";
import { CONTENT_WIDTH_PX, CONTENT_HEIGHT_PX, PAGE_GAP_PX } from "@/utils/page";
import { toFontStack } from "@/utils/font";

interface PaginatedCvProps {
  cv: Cv;
  /** Notifie le parent (ex. export PDF) que la pagination est prête, avec le nombre de pages. */
  onReady?: (pageCount: number) => void;
  className?: string;
}

/**
 * Rend un CV réparti en pages A4 réelles.
 * `ref` pointe le conteneur des pages : chaque page porte l'attribut `data-pdf-page` (utilisé par l'export PDF).
 */
export const PaginatedCv = forwardRef<HTMLDivElement, PaginatedCvProps>(({ cv, onReady, className }, ref) => {
  const entries = useMemo(() => buildCvEntries(cv), [cv]);
  const fontFamily = toFontStack(cv.customization.fontFamily);
  const { measureRef, pages } = usePagination(entries, CONTENT_HEIGHT_PX, PAGE_GAP_PX);

  useEffect(() => {
    if (pages) onReady?.(pages.length);
  }, [pages, onReady]);

  return (
    <>
      {/* Conteneur de mesure : hors écran, à la largeur de contenu réelle d'une page A4. */}
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 flex flex-col opacity-0"
        style={{ width: CONTENT_WIDTH_PX, gap: PAGE_GAP_PX, transform: "translateX(-100000px)", fontFamily }}
      >
        {entries.map((entry) =>
          entry.type === "atom" ? (
            <div key={entry.id} data-mid={entry.id}>
              {entry.render()}
            </div>
          ) : (
            <div key={entry.groupId} data-mgroup={entry.groupId} className="flex flex-wrap gap-2">
              {entry.badges.map((b) => (
                <span key={b.id} data-bid={b.id}>
                  {b.render()}
                </span>
              ))}
            </div>
          ),
        )}
      </div>

      {/* Pages visibles. */}
      <div ref={ref} className={className}>
        <div className="flex flex-col items-center gap-6">
          {pages?.map((atoms, pageIndex) => (
            <Page key={pageIndex} className="shadow-card">
              <PageContent fontFamily={fontFamily}>
                {atoms.map((atom) => (
                  <div key={atom.id}>{atom.render()}</div>
                ))}
              </PageContent>
            </Page>
          ))}
        </div>
      </div>
    </>
  );
});
PaginatedCv.displayName = "PaginatedCv";
