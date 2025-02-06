import { useEffect } from "react";

export default function useShortcut(callback: () => void, keys: string[]) {
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && keys.includes(e.key)) {
        e.preventDefault();
        callback();
      }
    };

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, [callback, keys]);
}
