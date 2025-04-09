// REPO: @hitchsoftware/react-file-manager
// FILE: src/FileManager/Actions/Actions.tsx

import { useEffect, useState, ReactNode } from "react";
import Modal from "../../components/Modal/Modal";
import { useShortcutHandler } from "../../hooks/useShortcutHandler";
import { useSelection } from "../../contexts/SelectionContext";
import UploadFileAction from "./UploadFile/UploadFile.action";
import DeleteAction from "./Delete/Delete.action";
import PreviewFileAction from "./PreviewFile/PreviewFile.action";

interface FileUploadConfig {
  url?: string;
  headers?: Record<string, string>;
  method?: "POST" | "PUT";
  handler?: (event: React.ChangeEvent<HTMLInputElement>, filePath: string) => Promise<void>;
}

interface TriggerAction {
  isActive: boolean;
  actionType: keyof typeof actionTypes | string;
  close: () => void;
}

interface ActionsProps {
  fileUploadConfig?: FileUploadConfig;
  onFileUploading?: () => void;
  onFileUploaded?: (res: any) => void;
  onDelete?: (fileId: string) => void;
  onRefresh?: () => void;
  maxFileSize?: number;
  filePreviewPath?: string;
  filePreviewComponent?: React.FC<{ file: any }>;
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
  onFileUploading,
  onFileUploaded,
  onDelete,
  onRefresh,
  maxFileSize,
  filePreviewPath,
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
      component: <DeleteAction triggerAction={triggerAction} onDelete={onDelete} />,
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
    if (triggerAction.isActive) {
      const actionType = triggerAction.actionType;
      const baseAction = actionTypes[actionType];
      if (baseAction) {
        const dynamicTitle =
          actionType === "previewFile" ? selectedFiles?.name ?? "Preview" : baseAction.title;

        setActiveAction({
          ...baseAction,
          title: dynamicTitle,
        });
      }
    } else {
      setActiveAction(null);
    }
  }, [triggerAction.isActive, triggerAction.actionType, selectedFiles?.name]);

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
