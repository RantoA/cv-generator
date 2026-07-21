import { useEffect, useRef, useState } from "react";

/** Mesure en continu la hauteur réelle (post-layout) d'un élément. */
export function useElementHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height));
    observer.observe(el);
    setHeight(el.getBoundingClientRect().height);

    return () => observer.disconnect();
  }, []);

  return { ref, height };
}
