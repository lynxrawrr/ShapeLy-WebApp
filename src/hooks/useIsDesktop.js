import { useEffect, useState } from "react";

export function useIsDesktop(bp = 1100) {
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia(`(min-width:${bp}px)`).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(`(min-width:${bp}px)`);
    const onChange = (e) => setIsDesktop(e.matches);

    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, [bp]);

  return isDesktop;
}
