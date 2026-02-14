import { useEffect } from "react";

export function useBodyScrollLock(locked = true) {
  useEffect(() => {
    const body = document.body;

    if (locked) body.classList.add("noScroll");
    else body.classList.remove("noScroll");

    return () => body.classList.remove("noScroll");
  }, [locked]);
}
