// REPO: @hitchsoftware/react-file-manager
// FILE: src/contexts/ClipboardContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useSelection } from "./SelectionContext";
import { validateApiCallback } from "../utils/validateApiCallback";
import { FileEntity } from "../types/FileEntity";



interface ClipboardData {
  files: FileEntity[];
  isMoving: boolean;
}

interface ClipboardContextValue {
  clipBoard: ClipboardData | null;
  setClipBoard: React.Dispatch<React.SetStateAction<ClipboardData | null>>;
  handleCutCopy: (isMoving: boolean) => void;
  handlePasting: (destinationFolder: FileEntity) => void;
}

interface ClipBoardProviderProps {
  children: ReactNode;
  onPaste?: (
    files: FileEntity[],
    destinationFolder: FileEntity,
    operation: "move" | "copy"
  ) => void;
  onCut?: (files: FileEntity[]) => void;
  onCopy?: (files: FileEntity[]) => void;
}

// Provide a default (null) value casted properly
const ClipBoardContext = createContext<ClipboardContextValue | null>(null);

export const ClipBoardProvider: React.FC<ClipBoardProviderProps> = ({
  children,
  onPaste,
  onCut,
  onCopy,
}) => {
  const [clipBoard, setClipBoard] = useState<ClipboardData | null>(null);
  const { selectedFiles, setSelectedFiles } = useSelection();

  const handleCutCopy = (isMoving: boolean) => {
    setClipBoard({ files: selectedFiles, isMoving });

    if (isMoving) {
      onCut?.(selectedFiles);
    } else {
      onCopy?.(selectedFiles);
    }
  };

  const handlePasting = (destinationFolder: FileEntity) => {
    if (!destinationFolder?.isDirectory || !clipBoard) return;

    const copiedFiles = clipBoard.files;
    const operationType: "move" | "copy" = clipBoard.isMoving ? "move" : "copy";

    validateApiCallback(onPaste, "onPaste", copiedFiles, destinationFolder, operationType);

    if (clipBoard.isMoving) {
      setClipBoard(null);
    }

    setSelectedFiles([]);
  };

  return (
    <ClipBoardContext.Provider
      value={{ clipBoard, setClipBoard, handleCutCopy, handlePasting }}
    >
      {children}
    </ClipBoardContext.Provider>
  );
};

export const useClipBoard = (): ClipboardContextValue => {
  const context = useContext(ClipBoardContext);
  if (!context) {
    throw new Error("useClipBoard must be used within a ClipBoardProvider");
  }
  return context;
};
