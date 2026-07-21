/**
 * Lit un fichier image choisi par l'utilisateur, le redimensionne (côté max `maxSize`) et le
 * compresse en JPEG, puis renvoie une data URL prête à être stockée dans le CV (`photoUrl`) et
 * affichée telle quelle dans `<img src>`. Le redimensionnement garde la sauvegarde et l'export
 * PDF légers, même pour une photo haute résolution.
 */
export async function fileToResizedDataUrl(file: File, maxSize = 512, quality = 0.85): Promise<string> {
  const sourceUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image illisible"));
    image.src = sourceUrl;
  });

  let { width, height } = img;
  if (width > maxSize || height > maxSize) {
    const scale = maxSize / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return sourceUrl;

  // Fond blanc : évite qu'un PNG transparent devienne noir une fois exporté en JPEG.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", quality);
}
