export async function exportNodeToPdf(node: HTMLElement, fileName: string) {
  const safeName = fileName.trim().replace(/[^a-z0-9\-_ ]/gi, "").replace(/\s+/g, "_") || "cv";
  const { default: html2pdf } = await import("html2pdf.js");

  await html2pdf()
    .set({
      margin: 0,
      filename: `${safeName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    })
    .from(node)
    .save();
}
