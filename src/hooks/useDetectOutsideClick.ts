// REPO: @hitchsoftware/react-file-manager
// FILE: src/hooks/useDetectOutsideClick.ts

import { useEffect, useRef, useState } from "react";

type OutsideClickHandler = (
  event: MouseEvent | TouchEvent,
  ref: React.RefObject<HTMLElement>
) => void;

export const useDetectOutsideClick = (
  handleOutsideClick: OutsideClickHandler = () => {}
) => {
  const [isClicked, setIsClicked] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

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
};
