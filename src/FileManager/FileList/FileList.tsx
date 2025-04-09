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
import { FileEntity } from "../../types/FileEntity";
import { TriggerAction } from "../../types/TriggerAction";

interface FileListProps {
  onCreateFolder: (name: string) => void;
  onRename: (file: FileEntity, newName: string) => void;
  onFileOpen: (file: FileEntity) => void;
  onRefresh: () => void;
  enableFilePreview: boolean;
  triggerAction: TriggerAction;
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
  } = useFileList({ onRefresh, enableFilePreview, triggerAction });

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
              setLastSelectedFile={setLastSelectedFile as (file: FileEntity) => void}
            />
          ))}
        </>
      ) : (
        <div className="empty-folder">This folder is empty.</div>
      )}

      <ContextMenu
        filesViewRef={filesViewRef}
        contextMenuRef={contextMenuRef.ref as React.RefObject<HTMLDivElement>}
        menuItems={isSelectionCtx ? selecCtxItems : emptySelecCtxItems}
        visible={visible}
        clickPosition={clickPosition}
      />
    </div>
  );
};

FileList.displayName = "FileList";

export default FileList;
