import type { MeasuredAtom } from "./types";

function groupHeight(atoms: MeasuredAtom[], gap: number): number {
  return atoms.reduce((sum, a, i) => sum + a.height + (i > 0 ? gap : 0), 0);
}

/**
 * Marque « keepWithNext » l'ensemble des blocs d'une section qui tient entièrement dans une page :
 * la section se déplacera alors d'un bloc sur la page suivante plutôt que de se couper.
 * Les sections plus grandes qu'une page conservent uniquement l'anti-orphelin déjà posé sur leur en-tête.
 */
function keepSmallSectionsTogether(atoms: MeasuredAtom[], pageHeight: number, gap: number): MeasuredAtom[] {
  const result = atoms.map((a) => ({ ...a }));
  let i = 0;
  while (i < result.length) {
    let j = i;
    while (j + 1 < result.length && result[j + 1].sectionId === result[i].sectionId) j++;
    const section = result.slice(i, j + 1);
    if (section.length > 1 && groupHeight(section, gap) <= pageHeight) {
      for (let k = i; k < j; k++) result[k].keepWithNext = true;
    }
    i = j + 1;
  }
  return result;
}

/**
 * Répartit les blocs mesurés en pages A4.
 * - un bloc n'est jamais coupé ;
 * - une chaîne « keepWithNext » (titre + premier élément, ou section entière) bascule ensemble ;
 * - un bloc plus grand qu'une page est placé seul (débordement inévitable, jamais coupé).
 */
export function paginateAtoms(rawAtoms: MeasuredAtom[], pageHeight: number, gap: number): MeasuredAtom[][] {
  const atoms = keepSmallSectionsTogether(rawAtoms, pageHeight, gap);
  const pages: MeasuredAtom[][] = [];
  let current: MeasuredAtom[] = [];

  for (let i = 0; i < atoms.length; i++) {
    const atom = atoms[i];
    const projected = groupHeight([...current, atom], gap);

    if (projected > pageHeight && current.length > 0) {
      // Rupture avant `atom` : on remonte la chaîne keepWithNext pour ne pas laisser un titre orphelin.
      let k = i;
      while (k - 1 >= 0 && atoms[k - 1].keepWithNext && current.some((c) => c.id === atoms[k - 1].id)) {
        k--;
      }
      const moveCount = i - k;
      if (moveCount > 0 && moveCount < current.length) {
        const moved = current.splice(current.length - moveCount, moveCount);
        pages.push(current);
        current = [...moved, atom];
      } else {
        // Rien à remonter (ou toute la page doit bouger) : on ferme simplement la page.
        pages.push(current);
        current = [atom];
      }
    } else {
      current.push(atom);
    }
  }

  if (current.length > 0) pages.push(current);
  return pages;
}
