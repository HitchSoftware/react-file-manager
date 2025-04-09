// REPO: @hitchsoftware/react-file-manager
// FILE: src\FileManager\NavigationPane\NavigationPane.tsx

import React, { useEffect, useState } from "react";
import FolderTree from "./FolderTree";
import { getParentPath } from "../../utils/getParentPath";
import { useFiles } from "../../contexts/FilesContext";
import { FileEntity } from "../../types/FileEntity";
import "./NavigationPane.scss";
import { FolderNode } from "../../types/FolderNode";

export interface NavigationPaneProps {
  onFileOpen: (file: FileEntity) => void;
}



const NavigationPane: React.FC<NavigationPaneProps> = ({ onFileOpen }) => {
  const [foldersTree, setFoldersTree] = useState<FolderNode[]>([]);
  const { files } = useFiles();

  const createChildRecursive = (
    path: string,
    foldersStruct: Record<string, FileEntity[]>
  ): FolderNode[] => {
    if (!foldersStruct[path]) return [];
  
    return foldersStruct[path].map((folder): FolderNode => ({
      ...folder,
      subDirectories: createChildRecursive(folder.path, foldersStruct),
    }));
  };
  

  useEffect(() => {
    if (Array.isArray(files)) {
      const folders = files.filter((file) => file.isDirectory);
      // Grouping folders by parent path
      const foldersStruct = Object.groupBy(folders, ({ path }) => getParentPath(path)) as Record<string, FileEntity[]>;
      setFoldersTree(() => {
        const rootPath = "";
        return createChildRecursive(rootPath, foldersStruct);
      });
    }
  }, [files]);

  return (
    <div className="sb-folders-list">
      {foldersTree?.length > 0 ? (
        <>
          {foldersTree?.map((folder: FolderNode, index) => {
            return <FolderTree key={index} folder={folder} onFileOpen={onFileOpen} />;
          })}
        </>
      ) : (
        <div className="empty-nav-pane">Nothing here yet</div>
      )}
    </div>
  );
};

NavigationPane.displayName = "NavigationPane";

export default NavigationPane;
