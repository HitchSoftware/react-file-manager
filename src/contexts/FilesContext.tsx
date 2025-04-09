// REPO: @hitchsoftware/react-file-manager
// FILE: src/contexts/FilesContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { FileEntity } from "../types/FileEntity";

interface FilesContextValue {
  files: FileEntity[];
  setFiles: React.Dispatch<React.SetStateAction<FileEntity[]>>;
  getChildren: (file: FileEntity) => FileEntity[];
  onError?: (error: Error) => void;
}

interface FilesProviderProps {
  children: ReactNode;
  filesData: FileEntity[];
  onError?: (error: Error) => void;
}

const FilesContext = createContext<FilesContextValue | null>(null);

export const FilesProvider: React.FC<FilesProviderProps> = ({
  children,
  filesData,
  onError,
}) => {
  const [files, setFiles] = useState<FileEntity[]>([]);

  useEffect(() => {
    setFiles(filesData);
  }, [filesData]);

  const getChildren = (file: FileEntity): FileEntity[] => {
    if (!file.isDirectory) return [];

    return files.filter(
      (child) =>
        child.path === `${file.path}/${child.name}` &&
        child.id !== file.id // 💥 prevent self-referencing
    );
  };

  return (
    <FilesContext.Provider value={{ files, setFiles, getChildren, onError }}>
      {children}
    </FilesContext.Provider>
  );
};

export const useFiles = (): FilesContextValue => {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error("useFiles must be used within a FilesProvider");
  }
  return context;
};
