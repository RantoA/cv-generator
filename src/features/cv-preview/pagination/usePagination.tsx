import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { paginateAtoms } from "./paginate";
import type { Entry, MeasuredAtom } from "./types";

interface PaginationResult {
  /** À attacher au conteneur de mesure (rendu hors écran). */
  measureRef: React.RefObject<HTMLDivElement | null>;
  /** Pages calculées, ou `null` tant que la première mesure n'a pas eu lieu. */
  pages: MeasuredAtom[][] | null;
}

/**
 * Moteur de pagination A4 : mesure dynamiquement chaque bloc (getBoundingClientRect),
 * découpe les groupes de badges en lignes réelles, puis répartit le tout en pages.
 * Recalcule automatiquement quand la taille du contenu change (ResizeObserver).
 */
export function usePagination(entries: Entry[], pageHeight: number, gap: number): PaginationResult {
  const measureRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<MeasuredAtom[][] | null>(null);

  const compute = useCallback(() => {
    const container = measureRef.current;
    if (!container) return;

    const atoms: MeasuredAtom[] = [];

    for (const entry of entries) {
      if (entry.type === "atom") {
        const el = container.querySelector<HTMLElement>(`[data-mid="${entry.id}"]`);
        atoms.push({
          id: entry.id,
          sectionId: entry.sectionId,
          height: el?.getBoundingClientRect().height ?? 0,
          keepWithNext: entry.keepWithNext,
          render: entry.render,
        });
        continue;
      }

      // Groupe de badges : on lit la position réelle de chaque badge pour reconstituer les lignes.
      const groupEl = container.querySelector<HTMLElement>(`[data-mgroup="${entry.groupId}"]`);
      const chips = groupEl ? Array.from(groupEl.querySelectorAll<HTMLElement>("[data-bid]")) : [];
      const rows: { top: number; height: number; ids: string[] }[] = [];

      for (const chip of chips) {
        const top = Math.round(chip.offsetTop);
        const height = chip.getBoundingClientRect().height;
        let row = rows.find((r) => Math.abs(r.top - top) < 2);
        if (!row) {
          row = { top, height, ids: [] };
          rows.push(row);
        }
        row.height = Math.max(row.height, height);
        row.ids.push(chip.getAttribute("data-bid")!);
      }
      rows.sort((a, b) => a.top - b.top);

      rows.forEach((row, rowIndex) => {
        const rowBadges = row.ids
          .map((id) => entry.badges.find((b) => b.id === id))
          .filter((b): b is NonNullable<typeof b> => Boolean(b));
        atoms.push({
          id: `${entry.groupId}#row-${rowIndex}`,
          sectionId: entry.sectionId,
          height: row.height,
          keepWithNext: false,
          render: () => (
            <div className="flex flex-wrap gap-2">
              {rowBadges.map((b) => (
                <Fragment key={b.id}>{b.render()}</Fragment>
              ))}
            </div>
          ),
        });
      });
    }

    setPages(paginateAtoms(atoms, pageHeight, gap));
  }, [entries, pageHeight, gap]);

  useLayoutEffect(() => {
    compute();
  }, [compute]);

  useEffect(() => {
    const container = measureRef.current;
    if (!container) return;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(compute);
    });
    observer.observe(container);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [compute]);

  return { measureRef, pages };
}
