// REPO: @hitchsoftware/react-file-manager
// FILE: src/hooks/useColumnResize.ts

import { useRef, useState, MouseEvent } from "react";

interface ColSizes {
  col1: number;
  col2: number;
}

export const useColumnResize = (col1Size: number, col2Size: number) => {
  const [colSizes, setColSizes] = useState<ColSizes>({ col1: col1Size, col2: col2Size });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    e.preventDefault();

    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newCol1Size = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    if (newCol1Size >= 15 && newCol1Size <= 60) {
      setColSizes({ col1: newCol1Size, col2: 100 - newCol1Size });
    }
  };

  return {
    containerRef,
    colSizes,
    setColSizes,
    isDragging,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
  };
};
