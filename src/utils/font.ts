/**
 * Construit une pile de polices robuste à partir du choix utilisateur.
 * Indispensable pour l'export PDF : html2canvas mesure les métriques de la 1ʳᵉ police résolue ;
 * sans repli web-safe, une police non installée (Inter, Poppins…) fausse la position verticale du texte.
 */
export function toFontStack(fontFamily?: string): string {
  const primary = (fontFamily || "Inter").trim();
  const serifFonts = ["Georgia", "Merriweather", "Roboto Slab", "Times New Roman"];
  const isSerif = serifFonts.some((f) => primary.toLowerCase().includes(f.toLowerCase()));
  const fallback = isSerif ? `Georgia, "Times New Roman", serif` : `"Helvetica Neue", Arial, sans-serif`;
  return `"${primary}", ${fallback}`;
}
