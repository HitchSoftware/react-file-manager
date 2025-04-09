// REPO: @hitchsoftware/react-file-manager
// FILE: src/FileManager/FileList/FileList.tsx

import { useRef } from "react";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import { useDetectOutsideClick } from "../../hooks/useDetectOutsideClick";
import useFileList from "./useFileList";
import FilesHeader from "./FilesHeader";
import "./FileList.scss";
import { useFileNavigation } from "../../contexts/FileNavigationContext";
import { useLayout } from "../../contexts/LayoutContext";
import FileItem from "./FileItem";

interface FileEntity {
  name: string;
  path: string;
  isDirectory: boolean;
  isEditing?: boolean;
  updatedAt?: string;
  size?: number;
}

interface FileListProps {
  onCreateFolder: (name: string) => void;
  onRename: (file: FileEntity, newName: string) => void;
  onFileOpen: (file: FileEntity) => void;
  onRefresh: () => void;
  enableFilePreview: boolean;
  triggerAction: {
    isActive: boolean;
    actionType: string;
    show: (actionType: string) => void;
    close: () => void;
  };
}

const FileList: React.FC<FileListProps> = ({
  onCreateFolder,
  onRename,
  onFileOpen,
  onRefresh,
  enableFilePreview,
  triggerAction,
}) => {
  const { currentPathFiles } = useFileNavigation();
  const filesViewRef = useRef<HTMLDivElement>(null);
  const { activeLayout } = useLayout();

  const {
    emptySelecCtxItems,
    selecCtxItems,
    handleContextMenu,
    unselectFiles,
    visible,
    setVisible,
    setLastSelectedFile,
    selectedFileIndexes,
    clickPosition,
    isSelectionCtx,
  } = useFileList(onRefresh, enableFilePreview, triggerAction);

  const contextMenuRef = useDetectOutsideClick(() => setVisible(false));

  return (
    <div
      ref={filesViewRef}
      className={`files ${activeLayout}`}
      onContextMenu={handleContextMenu}
      onClick={unselectFiles}
    >
      {activeLayout === "list" && <FilesHeader unselectFiles={unselectFiles} />}

      {currentPathFiles?.length > 0 ? (
        <>
          {currentPathFiles.map((file: FileEntity, index: number) => (
            <FileItem
              key={index}
              index={index}
              file={file}
              onCreateFolder={onCreateFolder}
              onRename={onRename}
              onFileOpen={onFileOpen}
              enableFilePreview={enableFilePreview}
              triggerAction={triggerAction}
              filesViewRef={filesViewRef}
              selectedFileIndexes={selectedFileIndexes}
              handleContextMenu={handleContextMenu}
              setVisible={setVisible}
              setLastSelectedFile={setLastSelectedFile}
            />
          ))}
        </>
      ) : (
        <div className="empty-folder">This folder is empty.</div>
      )}

      <ContextMenu
        filesViewRef={filesViewRef}
        contextMenuRef={contextMenuRef.ref}
        menuItems={isSelectionCtx ? selecCtxItems : emptySelecCtxItems}
        visible={visible}
        clickPosition={clickPosition}
      />
    </div>
  );
};

FileList.displayName = "FileList";

export default FileList;
