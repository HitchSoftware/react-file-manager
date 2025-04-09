// REPO: @hitchsoftware/react-file-manager
// FILE: src/contexts/SelectionContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { validateApiCallback } from "../utils/validateApiCallback";
import { FileEntity } from "../types/FileEntity";

interface SelectionContextValue {
  selectedFiles: FileEntity[];
  setSelectedFiles: Dispatch<SetStateAction<FileEntity[]>>;
  handleDownload: () => void;
}

interface SelectionProviderProps {
  children: ReactNode;
  onDownload?: (files: FileEntity[]) => void;
  onSelect?: (files: FileEntity[]) => void;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export const SelectionProvider: React.FC<SelectionProviderProps> = ({
  children,
  onDownload,
  onSelect,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<FileEntity[]>([]);

  useEffect(() => {
    if (selectedFiles.length && onSelect) {
      onSelect(selectedFiles);
    }
  }, [selectedFiles, onSelect]);

  const handleDownload = () => {
    validateApiCallback(onDownload, "onDownload", selectedFiles);
  };

  return (
    <SelectionContext.Provider value={{ selectedFiles, setSelectedFiles, handleDownload }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = (): SelectionContextValue => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
};
