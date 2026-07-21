import type { ReactNode } from "react";

/** Un bloc atomique : ne sera jamais coupé entre deux pages. */
export interface AtomEntry {
  type: "atom";
  id: string;
  /** Section logique à laquelle appartient le bloc (utilisé pour « garder ensemble » une section entière). */
  sectionId: string;
  /** Garde ce bloc collé au bloc suivant (évite les titres orphelins en bas de page). */
  keepWithNext: boolean;
  render: () => ReactNode;
}

/** Un groupe de badges qui s'enroulent et peuvent se répartir sur plusieurs pages, mais jamais un badge coupé. */
export interface BadgesEntry {
  type: "badges";
  groupId: string;
  sectionId: string;
  badges: { id: string; render: () => ReactNode }[];
}

export type Entry = AtomEntry | BadgesEntry;

/** Bloc mesuré prêt à être réparti en pages. */
export interface MeasuredAtom {
  id: string;
  sectionId: string;
  height: number;
  keepWithNext: boolean;
  render: () => ReactNode;
}
