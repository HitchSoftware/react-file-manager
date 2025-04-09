// REPO: @hitchsoftware/react-file-manager
// FILE: src/FileManager/FileList/FileItem.tsx

import { useEffect, useRef, useState } from "react";
import { FaRegFile, FaRegFolderOpen } from "react-icons/fa6";
import { useFileIcons } from "../../hooks/useFileIcons";
import { getDataSize } from "../../utils/getDataSize";
import { formatDate } from "../../utils/formatDate";
import Checkbox from "../../components/Checkbox/Checkbox";
import { useLayout } from "../../contexts/LayoutContext";
import { useFileNavigation } from "../../contexts/FileNavigationContext";
import { useSelection } from "../../contexts/SelectionContext";
import { useClipBoard } from "../../contexts/ClipboardContext";
import CreateFolderAction from "../Actions/CreateFolder/CreateFolder.action";

const dragIconSize = 50;

interface FileEntity {
  name: string;
  path: string;
  isDirectory: boolean;
  isEditing?: boolean;
  updatedAt?: string;
  size?: number;
}

interface FileItemProps {
  index: number;
  file: FileEntity;
  onCreateFolder: (name: string) => void;
  onRename: (file: FileEntity, newName: string) => void;
  enableFilePreview: boolean;
  onFileOpen: (file: FileEntity) => void;
  filesViewRef: React.RefObject<HTMLDivElement>;
  selectedFileIndexes: number[];
  triggerAction: { actionType: string; show: (type: string) => void };
  handleContextMenu: (e: React.MouseEvent, fromFile: boolean) => void;
  setLastSelectedFile: (file: FileEntity) => void;
}

interface TooltipPosition {
  x: number;
  y: number;
}

const FileItem: React.FC<FileItemProps> = ({
  index,
  file,
  onCreateFolder,
  onRename,
  enableFilePreview,
  onFileOpen,
  filesViewRef,
  selectedFileIndexes,
  triggerAction,
  handleContextMenu,
  setLastSelectedFile,
}) => {
  const [fileSelected, setFileSelected] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [checkboxClassName, setCheckboxClassName] = useState("hidden");
  const [dropZoneClass, setDropZoneClass] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);

  const { activeLayout } = useLayout();
  const iconSize = activeLayout === "grid" ? 48 : 20;
  const fileIcons = useFileIcons(iconSize);
  const { setCurrentPath, currentPathFiles } = useFileNavigation();
  const { setSelectedFiles } = useSelection();
  const { clipBoard, handleCutCopy, setClipBoard, handlePasting } = useClipBoard();
  const dragIconRef = useRef<HTMLDivElement>(null);
  const dragIcons = useFileIcons(dragIconSize);

  const isFileMoving =
    clipBoard?.isMoving &&
    clipBoard.files.some((f: FileEntity) => f.name === file.name && f.path === file.path);

  const handleFileAccess = () => {
    onFileOpen(file);
    if (file.isDirectory) {
      setCurrentPath(file.path);
      setSelectedFiles([]);
    } else {
      enableFilePreview && triggerAction.show("previewFile");
    }
  };

  const handleFileRangeSelection = (shiftKey: boolean, ctrlKey: boolean) => {
    if (selectedFileIndexes.length > 0 && shiftKey) {
      let startRange = selectedFileIndexes[0];
      let endRange = index;
      if (startRange >= endRange) [startRange, endRange] = [endRange, startRange];
      const filesRange = currentPathFiles.slice(startRange, endRange + 1);
      setSelectedFiles(startRange > endRange ? filesRange.reverse() : filesRange);
    } else if (selectedFileIndexes.length > 0 && ctrlKey) {
      setSelectedFiles((prev) => {
        const filtered = prev.filter((f) => f.path !== file.path);
        return filtered.length === prev.length ? [...prev, file] : filtered;
      });
    } else {
      setSelectedFiles([file]);
    }
  };

  const handleFileSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (file.isEditing) return;

    handleFileRangeSelection(e.shiftKey, e.ctrlKey);

    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime < 300) {
      handleFileAccess();
      return;
    }
    setLastClickTime(currentTime);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.stopPropagation();
      setSelectedFiles([file]);
      handleFileAccess();
    }
  };

  const handleItemContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (file.isEditing) return;
    if (!fileSelected) setSelectedFiles([file]);

    setLastSelectedFile(file);
    handleContextMenu(e, true);
  };

  const handleMouseOver = () => setCheckboxClassName("visible");
  const handleMouseLeave = () => !fileSelected && setCheckboxClassName("hidden");

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedFiles((prev) => [...prev, file]);
    } else {
      setSelectedFiles((prev) => prev.filter((f) => f.name !== file.name || f.path !== file.path));
    }
    setFileSelected(e.target.checked);
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (dragIconRef.current) {
      e.dataTransfer.setDragImage(dragIconRef.current, 30, 50);
    }
    e.dataTransfer.effectAllowed = "copy";
    handleCutCopy(true);
  };

  const handleDragEnd = () => setClipBoard(null);

  const handleDragEnterOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (fileSelected || !file.isDirectory) {
      e.dataTransfer.dropEffect = "none";
    } else {
      setTooltipPosition({ x: e.clientX, y: e.clientY + 12 });
      e.dataTransfer.dropEffect = "copy";
      setDropZoneClass("file-drop-zone");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropZoneClass("");
      setTooltipPosition(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (fileSelected || !file.isDirectory) return;

    handlePasting(file);
    setDropZoneClass("");
    setTooltipPosition(null);
  };

  useEffect(() => {
    setFileSelected(selectedFileIndexes.includes(index));
    setCheckboxClassName(selectedFileIndexes.includes(index) ? "visible" : "hidden");
  }, [selectedFileIndexes, index]);

  return (
    <div
      className={`file-item-container ${dropZoneClass} ${
        fileSelected || file.isEditing ? "file-selected" : ""
      } ${isFileMoving ? "file-moving" : ""}`}
      tabIndex={0}
      title={file.name}
      onClick={handleFileSelection}
      onKeyDown={handleOnKeyDown}
      onContextMenu={handleItemContextMenu}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      draggable={fileSelected}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragEnter={handleDragEnterOver}
      onDragOver={handleDragEnterOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="file-item">
        {!file.isEditing && (
          <Checkbox
            name={file.name}
            id={file.name}
            checked={fileSelected}
            className={`selection-checkbox ${checkboxClassName}`}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        {file.isDirectory ? (
          <FaRegFolderOpen size={iconSize} />
        ) : (
          fileIcons[file.name?.split(".").pop()?.toLowerCase() ?? ""] ?? (
            <FaRegFile size={iconSize} />
          )
        )}

        {file.isEditing ? (
          <div className={`rename-file-container ${activeLayout}`}>
            {triggerAction.actionType === "createFolder" ? (
              <CreateFolderAction
                filesViewRef={filesViewRef}
                file={file}
                onCreateFolder={onCreateFolder}
                triggerAction={triggerAction}
              />
            ) : (
              <RenameAction
                filesViewRef={filesViewRef}
                file={file}
                onRename={onRename}
                triggerAction={triggerAction}
              />
            )}
          </div>
        ) : (
          <span className="text-truncate file-name">{file.name}</span>
        )}
      </div>

      {activeLayout === "list" && (
        <>
          <div className="modified-date">{formatDate(file.updatedAt ?? "")}</div>
          <div className="size">{file.size ? getDataSize(file.size) : ""}</div>
        </>
      )}

      {tooltipPosition && (
        <div
          style={{ top: `${tooltipPosition.y}px`, left: `${tooltipPosition.x}px` }}
          className="drag-move-tooltip"
        >
          Move to <span className="drop-zone-file-name">{file.name}</span>
        </div>
      )}

      <div ref={dragIconRef} className="drag-icon">
        {file.isDirectory ? (
          <FaRegFolderOpen size={dragIconSize} />
        ) : (
          dragIcons[file.name?.split(".").pop()?.toLowerCase() ?? ""] ?? (
            <FaRegFile size={dragIconSize} />
          )
        )}
      </div>
    </div>
  );
};

export default FileItem;
