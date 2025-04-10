// REPO: @hitchsoftware/react-file-manager
// FILE: src/FileManager/NavigationPane/FolderTree.tsx

import React, { useEffect, useState } from "react";
import Collapse from "../../components/Collapse/Collapse";
import { FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useFileNavigation } from "../../contexts/FileNavigationContext";
import { FolderNode } from "../../types/FolderNode";


interface FolderTreeProps {
  folder: FolderNode;
  onFileOpen: (folder: FolderNode) => void;
}

const FolderTree: React.FC<FolderTreeProps> = ({ folder, onFileOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const { currentPath, setCurrentPath } = useFileNavigation();

  const handleFolderSwitch = () => {
    setIsActive(true);
    onFileOpen(folder);
    setCurrentPath(folder.path);
  };

  const handleCollapseChange = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    setIsActive(currentPath === folder.path);

    const currentPathArray = currentPath.split("/");
    currentPathArray.pop();
    const currentFolderParentPath = currentPathArray.join("/");
    if (currentFolderParentPath === folder.path) {
      setIsOpen(true);
    }
  }, [currentPath, folder.path]);

  if (folder?.subDirectories?.length ?? 0 > 0) {
    return (
      <>
        <div
          className={`sb-folders-list-item ${isActive ? "active-list-item" : ""}`}
          onClick={handleFolderSwitch}
        >
          <span onClick={handleCollapseChange}>
            <MdKeyboardArrowRight
              size={20}
              className={`folder-icon-default ${isOpen ? "folder-rotate-down" : ""}`}
            />
          </span>
          <div className="sb-folder-details">
            {isOpen || isActive ? (
              <FaRegFolderOpen size={20} className="folder-open-icon" />
            ) : (
              <FaRegFolder size={17} className="folder-close-icon" />
            )}
            <span className="sb-folder-name" title={folder.name}>
              {folder.name}
            </span>
          </div>
        </div>
        <Collapse open={isOpen}>
          <div className="folder-collapsible">
            {folder?.subDirectories?.map((item: FolderNode, index: number) => (
              <FolderTree key={index} folder={item} onFileOpen={onFileOpen} />
            ))}
          </div>
        </Collapse>
      </>
    );
  } else {
    return (
      <div
        className={`sb-folders-list-item ${isActive ? "active-list-item" : ""}`}
        onClick={handleFolderSwitch}
      >
        <span className="non-expanable"></span>
        <div className="sb-folder-details">
          {isActive ? (
            <FaRegFolderOpen size={20} className="folder-open-icon" />
          ) : (
            <FaRegFolder size={17} className="folder-close-icon" />
          )}
          <span className="sb-folder-name" title={folder.name}>
            {folder.name}
          </span>
        </div>
      </div>
    );
  }
};

export default FolderTree;
