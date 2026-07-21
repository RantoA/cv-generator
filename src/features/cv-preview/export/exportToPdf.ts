import { A4_WIDTH_MM, A4_HEIGHT_MM } from "@/utils/page";

/**
 * Exporte en PDF A4 chaque page déjà paginée par le moteur.
 * Chaque `[data-pdf-page]` est rasterisé puis placé en pleine page : le rendu est donc
 * strictement identique quel que soit le navigateur (Chrome, Firefox, Edge), et aucune
 * section n'est coupée puisque la découpe a déjà été faite côté React.
 */
export async function exportContainerToPdf(container: HTMLElement, fileName: string) {
  const safeName = fileName.trim().replace(/[^a-z0-9\-_ ]/gi, "").replace(/\s+/g, "_") || "cv";
  const pageEls = Array.from(container.querySelectorAll<HTMLElement>("[data-pdf-page]"));
  if (pageEls.length === 0) return;

  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);

  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  for (let i = 0; i < pageEls.length; i++) {
    const canvas = await html2canvas(pageEls[i], {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    const image = canvas.toDataURL("image/jpeg", 0.98);
    if (i > 0) pdf.addPage();
    pdf.addImage(image, "JPEG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, "FAST");
  }

  pdf.save(`${safeName}.pdf`);
}
