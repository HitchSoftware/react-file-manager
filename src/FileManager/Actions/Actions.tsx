// REPO: @hitchsoftware/react-file-manager
// FILE: src/FileManager/Actions/Actions.tsx

import { useEffect, useState, ReactNode } from "react";
import Modal from "../../components/Modal/Modal";
import { useShortcutHandler } from "../../hooks/useShortcutHandler";
import { useSelection } from "../../contexts/SelectionContext";
import UploadFileAction from "./UploadFile/UploadFile.action";
import DeleteAction from "./Delete/Delete.action";
import PreviewFileAction from "./PreviewFile/PreviewFile.action";
import { TriggerAction } from "../../types/TriggerAction";
import { FileEntity } from "../../types/FileEntity";

interface FileUploadConfig {
  url?: string;
  headers?: Record<string, string>;
  method?: "POST" | "PUT";
  handler?: (event: React.ChangeEvent<HTMLInputElement>, filePath: string) => Promise<void>;
}

interface ActionsProps {
  fileUploadConfig?: FileUploadConfig;
  onFileUploading?: (file: FileEntity, currentFolder: any) => any;
  onFileUploaded?: (file: FileEntity, response: any) => void;
  onDelete?: (files: FileEntity[]) => void;
  onRefresh?: () => void;
  maxFileSize?: number;
  filePreviewPath?: string;
  filePreviewComponent?: (file: FileEntity) => React.ReactNode;
  acceptedFileTypes?: string;
  triggerAction: TriggerAction;
}

interface ActionType {
  title: string;
  component: ReactNode;
  width: string;
}

const Actions: React.FC<ActionsProps> = ({
  fileUploadConfig,
  onFileUploading = () => {},
  onFileUploaded = () => {},
  onDelete = () => {},
  onRefresh = () => {},
  maxFileSize,
  filePreviewPath = "",
  filePreviewComponent,
  acceptedFileTypes,
  triggerAction,
}) => {
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
  const { selectedFiles } = useSelection();

  useShortcutHandler(triggerAction, onRefresh);

  const actionTypes: Record<string, ActionType> = {
    uploadFile: {
      title: "Upload",
      component: (
        <UploadFileAction
          fileUploadConfig={fileUploadConfig}
          maxFileSize={maxFileSize}
          acceptedFileTypes={acceptedFileTypes}
          onFileUploading={onFileUploading}
          onFileUploaded={onFileUploaded}
        />
      ),
      width: "35%",
    },
    delete: {
      title: "Delete",
      component: (
        <DeleteAction triggerAction={triggerAction} onDelete={onDelete} />
      ),
      width: "25%",
    },
    previewFile: {
      title: "Preview",
      component: (
        <PreviewFileAction
          filePreviewPath={filePreviewPath}
          filePreviewComponent={filePreviewComponent}
        />
      ),
      width: "50%",
    },
  };

  useEffect(() => {
    if (triggerAction.isActive && triggerAction.actionType) {
      const baseAction = actionTypes[triggerAction.actionType];
      if (baseAction) {
        const dynamicTitle =
          triggerAction.actionType === "previewFile"
            ? selectedFiles?.[0]?.name ?? "Preview"
            : baseAction.title;

        setActiveAction({
          ...baseAction,
          title: dynamicTitle,
        });
      }
    } else {
      setActiveAction(null);
    }
  }, [triggerAction.isActive, triggerAction.actionType, selectedFiles]);

  if (activeAction) {
    return (
      <Modal
        heading={activeAction.title}
        show={triggerAction.isActive}
        setShow={triggerAction.close}
        dialogWidth={activeAction.width}
      >
        {activeAction.component}
      </Modal>
    );
  }

  return null;
};

export default Actions;
