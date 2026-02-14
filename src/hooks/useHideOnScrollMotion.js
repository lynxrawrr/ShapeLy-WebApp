import { useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

export function useHideOnScrollMotion({ threshold = 8, topOffset = 6 } = {}) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    const delta = latest - prev;

    if (latest <= topOffset) {
      if (hidden) setHidden(false);
      return;
    }

    if (Math.abs(delta) < threshold) return;

    if (delta > 0) {
      if (!hidden) setHidden(true);
    } else {
      if (hidden) setHidden(false);
    }
  });

  return hidden;
}
