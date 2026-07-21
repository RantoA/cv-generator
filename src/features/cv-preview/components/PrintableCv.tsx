import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Cv } from "@/types/cv.types";
import { buildCvEntries } from "../pagination/cvEntries";
import { toFontStack } from "@/utils/font";
import { CONTENT_WIDTH_PX, PAGE_GAP_PX } from "@/utils/page";

interface PrintableCvProps {
  cv: Cv;
  onDone: () => void;
}

const atomStyle = { breakInside: "avoid", pageBreakInside: "avoid" } as const;
const headerStyle = { ...atomStyle, breakAfter: "avoid", pageBreakAfter: "avoid" } as const;

/**
 * Rend le CV en flux continu (sans pagination virtuelle à hauteur fixe) directement dans
 * `<body>`, masqué à l'écran, visible uniquement à l'impression. Le navigateur répartit
 * lui-même le contenu sur autant de pages physiques que nécessaire (`@page` dans globals.css) :
 * aucune hauteur de page n'est présupposée, donc aucun risque de coupure si le format papier
 * réel (choisi par l'utilisateur ou l'OS) diffère de l'A4 — le contenu déborde sur une page
 * supplémentaire plutôt que d'être tronqué.
 */
export function PrintableCv({ cv, onDone }: PrintableCvProps) {
  const entries = buildCvEntries(cv);
  const fontFamily = toFontStack(cv.customization.fontFamily);

  useEffect(() => {
    // Ne masque le reste de l'appli à l'impression que pendant cet export : un Ctrl+P
    // « brut » ailleurs (sans passer par ce composant) doit imprimer normalement,
    // jamais une page blanche.
    document.body.classList.add("printable-cv-active");
    const frame = requestAnimationFrame(() => window.print());
    window.addEventListener("afterprint", onDone);
    return () => {
      document.body.classList.remove("printable-cv-active");
      cancelAnimationFrame(frame);
      window.removeEventListener("afterprint", onDone);
    };
  }, [onDone]);

  return createPortal(
    <div className="hidden print:block" style={{ fontFamily }}>
      {/* Largeur contrainte à la zone imprimable A4 (largeur page − marges @page) : la mise
          en page est alors identique à l'aperçu React, dates/colonnes comprises, au lieu
          de s'étirer sur toute la largeur du body. */}
      <div className="mx-auto flex flex-col" style={{ gap: PAGE_GAP_PX, width: CONTENT_WIDTH_PX }}>
        {entries.map((entry) =>
          entry.type === "atom" ? (
            <div key={entry.id} style={entry.keepWithNext ? headerStyle : atomStyle}>
              {entry.render()}
            </div>
          ) : (
            <div key={entry.groupId} className="flex flex-wrap gap-2">
              {entry.badges.map((b) => (
                <div key={b.id} style={atomStyle}>
                  {b.render()}
                </div>
              ))}
            </div>
          ),
        )}
      </div>
    </div>,
    document.body,
  );
}
