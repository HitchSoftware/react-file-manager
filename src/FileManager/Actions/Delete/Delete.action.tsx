// REPO: @hitchsoftware/react-file-manager
// FILE: src\FileManager\Actions\Delete\Delete.action.tsx

import React, { useEffect, useState } from "react";
import Button from "../../../components/Button/Button";
import "./Delete.action.scss";
import { useSelection } from "../../../contexts/SelectionContext";

interface FileEntity {
  name: string;
  [key: string]: any;
}

interface DeleteActionProps {
  triggerAction: {
    close: () => void;
  };
  onDelete: (files: FileEntity[]) => void;
}

const DeleteAction: React.FC<DeleteActionProps> = ({ triggerAction, onDelete }) => {
  const [deleteMsg, setDeleteMsg] = useState<string>("");
  const { selectedFiles, setSelectedFiles } = useSelection();

  useEffect(() => {
    if (selectedFiles.length === 1) {
      setDeleteMsg(`Are you sure you want to delete "${selectedFiles[0].name}"?`);
    } else if (selectedFiles.length > 1) {
      setDeleteMsg(`Are you sure you want to delete these ${selectedFiles.length} items?`);
    }
  }, [selectedFiles]);

  const handleDeleting = () => {
    onDelete(selectedFiles);
    setSelectedFiles([]);
    triggerAction.close();
  };

  return (
    <div className="file-delete-confirm">
      <p className="file-delete-confirm-text">{deleteMsg}</p>
      <div className="file-delete-confirm-actions">
        <Button type="secondary" onClick={() => triggerAction.close()}>
          Cancel
        </Button>
        <Button type="danger" onClick={handleDeleting}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default DeleteAction;
