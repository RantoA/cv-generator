/** Dimensions et marges A4 (format 21 × 29,7 cm) partagées par l'aperçu paginé et l'export PDF. */
export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
/** Marge haut/bas de 2 cm (exigence produit). */
export const MARGIN_V_MM = 20;
/** Marge gauche/droite. */
export const MARGIN_H_MM = 15;

const MM_TO_PX = 96 / 25.4;

export const A4_WIDTH_PX = Math.round(A4_WIDTH_MM * MM_TO_PX);
export const A4_HEIGHT_PX = Math.round(A4_HEIGHT_MM * MM_TO_PX);
export const MARGIN_V_PX = Math.round(MARGIN_V_MM * MM_TO_PX);
export const MARGIN_H_PX = Math.round(MARGIN_H_MM * MM_TO_PX);

/** Largeur de contenu réelle d'une page (hors marges latérales). */
export const CONTENT_WIDTH_PX = A4_WIDTH_PX - MARGIN_H_PX * 2;
/** Hauteur de contenu réelle d'une page (hors marges haut/bas) : c'est l'espace de pagination. */
export const CONTENT_HEIGHT_PX = A4_HEIGHT_PX - MARGIN_V_PX * 2;

/** Espace vertical uniforme entre deux blocs empilés dans une page. */
export const PAGE_GAP_PX = 10;
