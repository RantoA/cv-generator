import { forwardRef, type ReactNode } from "react";
import {
  A4_WIDTH_PX,
  A4_HEIGHT_PX,
  MARGIN_V_PX,
  MARGIN_H_PX,
  PAGE_GAP_PX,
} from "@/utils/page";
import { cn } from "@/lib/utils";

/** Une page A4 physique (21 × 29,7 cm) avec marges haut/bas de 2 cm. Fond blanc « papier », indépendant du thème. */
export const Page = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(
  ({ children, className }, ref) => (
    <div
      ref={ref}
      className={cn("relative overflow-hidden bg-white text-[#1F2937]", className)}
      style={{
        width: A4_WIDTH_PX,
        height: A4_HEIGHT_PX,
        paddingTop: MARGIN_V_PX,
        paddingBottom: MARGIN_V_PX,
        paddingLeft: MARGIN_H_PX,
        paddingRight: MARGIN_H_PX,
      }}
    >
      {children}
    </div>
  ),
);
Page.displayName = "Page";

/** Zone de contenu d'une page : pile verticale à espacement constant. */
export function PageContent({ children, fontFamily }: { children: ReactNode; fontFamily?: string }) {
  return (
    <div className="flex flex-col" style={{ gap: PAGE_GAP_PX, fontFamily }}>
      {children}
    </div>
  );
}

/** Marqueur de saut de page explicite (fallback CSS print). */
export function PageBreak() {
  return <div aria-hidden style={{ breakBefore: "page", pageBreakBefore: "always" }} />;
}

const keepTogetherStyle = { breakInside: "avoid", pageBreakInside: "avoid" } as const;

/** Enveloppe un contenu qui ne doit jamais être coupé entre deux pages (fallback CSS pour l'impression navigateur). */
export function KeepTogether({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={className} style={keepTogetherStyle}>
      {children}
    </div>
  );
}

/** Section imprimable insécable (titre + contenu court). */
export function PrintableSection({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={className} style={keepTogetherStyle}>
      {children}
    </section>
  );
}

/** Carte imprimable insécable (expérience, formation, ligne de tableau…). */
export function PrintableCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={className} style={keepTogetherStyle}>
      {children}
    </div>
  );
}
