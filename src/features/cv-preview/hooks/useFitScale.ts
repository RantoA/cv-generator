import { useEffect, useRef, useState } from "react";
import { A4_WIDTH_PX } from "@/utils/page";

/** Calcule le facteur d'échelle pour faire tenir un contenu large de A4_WIDTH_PX dans son conteneur. */
export function useFitScale<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const width = el.clientWidth;
      if (width > 0) setScale(Math.min(1, width / A4_WIDTH_PX));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { containerRef, scale };
}
