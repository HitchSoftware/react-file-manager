// REPO: @hitchsoftware/react-file-manager
// FILE: src\FileManager\FileManager.tsx

import Loader from "../components/Loader/Loader";
import { useTriggerAction } from "../hooks/useTriggerAction";
import { useColumnResize } from "../hooks/useColumnResize";
import { ReactNode } from "react";
import "./FileManager.scss";
import { FilesProvider } from "../contexts/FilesContext";
import { FileNavigationProvider } from "../contexts/FileNavigationContext";
import { SelectionProvider } from "../contexts/SelectionContext";
import { ClipBoardProvider } from "../contexts/ClipboardContext";
import { LayoutProvider } from "../contexts/LayoutContext";
import Toolbar from "./Toolbar/Toolbar";
import NavigationPane from "./NavigationPane/NavigationPane";
import BreadCrumb from "./BreadCrumb/BreadCrumb";
import FileList from "./FileList/FileList";
import Actions from "./Actions/Actions";

export interface FileItem {
  name: string;
  isDirectory: boolean;
  path: string;
  updatedAt?: string;
  size?: number;
}

export interface FileUploadConfig {
  url: string;
  headers?: Record<string, string>;
  method?: "POST" | "PUT";
}

interface FileManagerProps {
  files: FileItem[];
  fileUploadConfig?: FileUploadConfig;
  isLoading?: boolean;
  onCreateFolder?: () => void;
  onFileUploading?: () => void;
  onFileUploaded?: () => void;
  onCut?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onRename?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  onLayoutChange?: (layout: "grid" | "list") => void;
  onRefresh?: () => void;
  onFileOpen?: (file: FileItem) => void;
  onSelect?: (selectedFiles: FileItem[]) => void;
  onError?: (error: any) => void;
  layout?: "grid" | "list";
  enableFilePreview?: boolean;
  maxFileSize?: number;
  filePreviewPath?: string;
  acceptedFileTypes?: string;
  height?: string | number;
  width?: string | number;
  initialPath?: string;
  filePreviewComponent?: React.ComponentType<any>;
  primaryColor?: string;
  fontFamily?: string;
}

const FileManager = ({
  files,
  fileUploadConfig,
  isLoading,
  onCreateFolder,
  onFileUploading = () => {},
  onFileUploaded = () => {},
  onCut,
  onCopy,
  onPaste,
  onRename,
  onDownload,
  onDelete = () => null,
  onLayoutChange = () => {},
  onRefresh,
  onFileOpen = () => {},
  onSelect,
  onError = () => {},
  layout = "grid",
  enableFilePreview = true,
  maxFileSize,
  filePreviewPath,
  acceptedFileTypes,
  height = "600px",
  width = "100%",
  initialPath = "",
  filePreviewComponent,
  primaryColor = "#6155b4",
  fontFamily = "Nunito Sans, sans-serif",
}: FileManagerProps) => {
  const triggerAction = useTriggerAction();
  const { containerRef, colSizes, isDragging, handleMouseMove, handleMouseUp, handleMouseDown } =
    useColumnResize(20, 80);
  const customStyles: React.CSSProperties = {
    ["--file-manager-font-family" as any]: fontFamily,
    ["--file-manager-primary-color" as any]: primaryColor,
    height,
    width,
  };

  return (
    <main className="file-explorer" onContextMenu={(e) => e.preventDefault()} style={customStyles}>
      <Loader loading={isLoading} />
      <FilesProvider filesData={files} onError={onError}>
        <FileNavigationProvider initialPath={initialPath}>
          <SelectionProvider onDownload={onDownload} onSelect={onSelect}>
            <ClipBoardProvider onPaste={onPaste} onCut={onCut} onCopy={onCopy}>
              <LayoutProvider layout={layout}>
                <Toolbar
                  allowCreateFolder
                  allowUploadFile
                  onLayoutChange={onLayoutChange}
                  onRefresh={onRefresh}
                  triggerAction={triggerAction}
                />
                <section
                  ref={containerRef}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  className="files-container"
                >
                  <div className="navigation-pane" style={{ width: colSizes.col1 + "%" }}>
                    <NavigationPane onFileOpen={onFileOpen} />
                    <div
                      className={`sidebar-resize ${isDragging ? "sidebar-dragging" : ""}`}
                      onMouseDown={handleMouseDown}
                    />
                  </div>

                  <div className="folders-preview" style={{ width: colSizes.col2 + "%" }}>
                    <BreadCrumb />
                    <FileList
                      onCreateFolder={onCreateFolder}
                      onRename={onRename}
                      onFileOpen={onFileOpen}
                      onRefresh={onRefresh}
                      enableFilePreview={enableFilePreview}
                      triggerAction={triggerAction}
                    />
                  </div>
                </section>

                <Actions
                  fileUploadConfig={fileUploadConfig}
                  onFileUploading={onFileUploading}
                  onFileUploaded={onFileUploaded}
                  onDelete={onDelete}
                  onRefresh={onRefresh}
                  maxFileSize={maxFileSize}
                  filePreviewPath={filePreviewPath}
                  filePreviewComponent={filePreviewComponent}
                  acceptedFileTypes={acceptedFileTypes}
                  triggerAction={triggerAction}
                />
              </LayoutProvider>
            </ClipBoardProvider>
          </SelectionProvider>
        </FileNavigationProvider>
      </FilesProvider>
    </main>
  );
};

export default FileManager;
