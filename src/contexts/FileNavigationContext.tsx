// REPO: @hitchsoftware/react-file-manager
// FILE: src/contexts/FileNavigationContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useFiles } from "./FilesContext";
import sortFiles from "../utils/sortFiles";

// Define a shared FileEntity type
interface FileEntity {
  name: string;
  path: string;
  isDirectory: boolean;
  [key: string]: any;
}

interface FileNavigationContextValue {
  currentPath: string;
  setCurrentPath: React.Dispatch<React.SetStateAction<string>>;
  currentFolder: FileEntity | null;
  setCurrentFolder: React.Dispatch<React.SetStateAction<FileEntity | null>>;
  currentPathFiles: FileEntity[];
  setCurrentPathFiles: React.Dispatch<React.SetStateAction<FileEntity[]>>;
}

interface FileNavigationProviderProps {
  children: ReactNode;
  initialPath: string;
}

// ✅ Create context with explicit default value
const FileNavigationContext = createContext<FileNavigationContextValue | null>(null);

export const FileNavigationProvider: React.FC<FileNavigationProviderProps> = ({
  children,
  initialPath,
}) => {
  const { files } = useFiles();
  const isMountRef = useRef(false);

  const [currentPath, setCurrentPath] = useState<string>("");
  const [currentFolder, setCurrentFolder] = useState<FileEntity | null>(null);
  const [currentPathFiles, setCurrentPathFiles] = useState<FileEntity[]>([]);

  useEffect(() => {
    if (Array.isArray(files) && files.length > 0) {
      const currPathFiles = files.filter(
        (file) => file.path === `${currentPath}/${file.name}`
      );
      setCurrentPathFiles(sortFiles(currPathFiles));

      const folder = files.find((file) => file.path === currentPath) ?? null;
      setCurrentFolder(folder);
    }
  }, [files, currentPath]);

  useEffect(() => {
    if (!isMountRef.current && Array.isArray(files) && files.length > 0) {
      setCurrentPath(files.some((file) => file.path === initialPath) ? initialPath : "");
      isMountRef.current = true;
    }
  }, [initialPath, files]);

  return (
    <FileNavigationContext.Provider
      value={{
        currentPath,
        setCurrentPath,
        currentFolder,
        setCurrentFolder,
        currentPathFiles,
        setCurrentPathFiles,
      }}
    >
      {children}
    </FileNavigationContext.Provider>
  );
};

export const useFileNavigation = (): FileNavigationContextValue => {
  const context = useContext(FileNavigationContext);
  if (!context) {
    throw new Error("useFileNavigation must be used within a FileNavigationProvider");
  }
  return context;
};
