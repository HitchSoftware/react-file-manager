// REPO: @hitchsoftware/react-file-manager
// FILE: src/hooks/useDetectOutsideClick.ts

import { useEffect, useRef, useState, MutableRefObject } from "react";

type OutsideClickHandler<T extends HTMLElement> = (
  event: MouseEvent | TouchEvent,
  ref: React.RefObject<T>
) => void;

export function useDetectOutsideClick<T extends HTMLElement = HTMLElement>(
  handleOutsideClick: OutsideClickHandler<T> = () => {}
) {
  const [isClicked, setIsClicked] = useState(false);
  const ref = useRef<T | null>(null);

  const handleClick = (event: MouseEvent | TouchEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsClicked(true);
      handleOutsideClick(event, ref);
    } else {
      setIsClicked(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick, true);
    document.addEventListener("mousedown", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("mousedown", handleClick, true);
    };
  }, []);

  return { ref, isClicked, setIsClicked };
}
