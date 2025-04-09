// REPO: @hitchsoftware/react-file-manager
// FILE: src/hooks/useKeyPress.ts

import { useEffect, useMemo, useRef } from "react";

const normalizeKey = (key: string): string => {
  return key.toLowerCase();
};

function isSubsetOf(set: Set<string>, subset: Set<string>): boolean {
  for (const item of subset) {
    if (!set.has(item)) return false;
  }
  return true;
}

export const useKeyPress = (
  keys: string[],
  callback: (e: KeyboardEvent) => void,
  disable: boolean = false
): void => {
  const lastKeyPressed = useRef<Set<string>>(new Set([]));

  const keysSet = useMemo<Set<string>>(() => {
    return new Set(keys.map((key: string) => normalizeKey(key)));
  }, [keys]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) return;

    lastKeyPressed.current.add(normalizeKey(e.key));

    if (isSubsetOf(lastKeyPressed.current, keysSet) && !disable) {
      e.preventDefault();
      callback(e);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    lastKeyPressed.current.delete(normalizeKey(e.key));
  };

  const handleBlur = () => {
    lastKeyPressed.current.clear();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [keysSet, callback, disable]);
};
