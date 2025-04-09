// REPO: @hitchsoftware/react-file-manager
// FILE: src\FileManager\Actions\CreateFolder\CreateFolder.action.tsx

import { useEffect, useState, KeyboardEvent, ChangeEvent, MouseEvent } from "react";
import { useDetectOutsideClick } from "../../../hooks/useDetectOutsideClick";
import { duplicateNameHandler } from "../../../utils/duplicateNameHandler";
import NameInput from "../../../components/NameInput/NameInput";
import ErrorTooltip from "../../../components/ErrorTooltip/ErrorTooltip";
import { useFileNavigation } from "../../../contexts/FileNavigationContext";
import { useLayout } from "../../../contexts/LayoutContext";
import { validateApiCallback } from "../../../utils/validateApiCallback";


const maxNameLength = 220;

interface FileEntity {
  id: string;
  name: string;
  path: string;
  key?: string;
  isDirectory: boolean;
  [key: string]: any;
}

interface CreateFolderActionProps {
  filesViewRef: React.RefObject<HTMLElement>;
  file: FileEntity;
  onCreateFolder: (name: string, currentFolder: FileEntity | null) => void;
  triggerAction: {
    close: () => void;
  };
}

const CreateFolderAction: React.FC<CreateFolderActionProps> = ({
  filesViewRef,
  file,
  onCreateFolder,
  triggerAction,
}) => {
  const [folderName, setFolderName] = useState(file.name);
  const [folderNameError, setFolderNameError] = useState(false);
  const [folderErrorMessage, setFolderErrorMessage] = useState("");
  const [errorXPlacement, setErrorXPlacement] = useState<"left" | "right">("right");
  const [errorYPlacement, setErrorYPlacement] = useState<"top" | "bottom">("bottom");

  const outsideClick = useDetectOutsideClick(() => {
    handleFolderCreating();
  });

  const { currentFolder, currentPathFiles, setCurrentPathFiles } = useFileNavigation();
  const { activeLayout } = useLayout();

  const handleFolderNameChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFolderName(e.target.value);
    setFolderNameError(false);
  };

  const handleValidateFolderName = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();

    if (e.key === "Enter") {
      e.preventDefault();
      handleFolderCreating();
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      triggerAction.close();
      setCurrentPathFiles((prev) => prev.filter((f) => f.key !== file.key));
      return;
    }

    const invalidCharsRegex = /[\\/:*?"<>|]/;
    if (invalidCharsRegex.test(e.key)) {
      e.preventDefault();
      setFolderErrorMessage(
        "A file name can't contain any of the following characters: \\ / : * ? \" < > |"
      );
      setFolderNameError(true);
    } else {
      setFolderNameError(false);
      setFolderErrorMessage("");
    }
  };

  useEffect(() => {
    if (folderNameError) {
      const autoHideError = setTimeout(() => {
        setFolderNameError(false);
        setFolderErrorMessage("");
      }, 7000);
      return () => clearTimeout(autoHideError);
    }
  }, [folderNameError]);

  function handleFolderCreating() {
    let newFolderName = folderName.trim();
    const syncedCurrPathFiles = currentPathFiles.filter((f) => f.key !== file.key);

    const alreadyExists = syncedCurrPathFiles.find(
      (f) => f.name.toLowerCase() === newFolderName.toLowerCase()
    );

    if (alreadyExists) {
      setFolderErrorMessage(`This destination already contains a folder named '${newFolderName}'.`);
      setFolderNameError(true);
      outsideClick.ref.current?.focus();
      outsideClick.ref.current?.select();
      outsideClick.setIsClicked(false);
      return;
    }

    if (newFolderName === "") {
      newFolderName = duplicateNameHandler("New Folder", true, syncedCurrPathFiles);
    }

    validateApiCallback(onCreateFolder, "onCreateFolder", newFolderName, currentFolder);
    setCurrentPathFiles((prev) => prev.filter((f) => f.key !== file.key));
    triggerAction.close();
  }

  useEffect(() => {
    outsideClick.ref.current?.focus();
    outsideClick.ref.current?.select();

    if (outsideClick.ref.current && filesViewRef.current) {
      const errorMessageWidth = 292 + 8 + 8 + 5;
      const errorMessageHeight = 56 + 20 + 10 + 2;

      const filesContainer = filesViewRef.current;
      const filesContainerRect = filesContainer.getBoundingClientRect();

      const nameInputContainer = outsideClick.ref.current;
      const nameInputContainerRect = nameInputContainer.getBoundingClientRect();

      const rightAvailableSpace = filesContainerRect.right - nameInputContainerRect.left;
      setErrorXPlacement(rightAvailableSpace > errorMessageWidth ? "right" : "left");

      const bottomAvailableSpace =
        filesContainerRect.bottom -
        (nameInputContainerRect.top + nameInputContainer.clientHeight);
      setErrorYPlacement(bottomAvailableSpace > errorMessageHeight ? "bottom" : "top");
    }
  }, []);

  useEffect(() => {
    if (outsideClick.isClicked) {
      handleFolderCreating();
    }
  }, [outsideClick.isClicked]);

  return (
    <>
      <NameInput
        nameInputRef={outsideClick.ref}
        maxLength={maxNameLength}
        value={folderName}
        onChange={handleFolderNameChange}
        onKeyDown={handleValidateFolderName}
        onClick={(e: MouseEvent) => e.stopPropagation()}
        {...(activeLayout === "list" && { rows: 1 })}
      />
      {folderNameError && (
        <ErrorTooltip
          message={folderErrorMessage}
          xPlacement={errorXPlacement}
          yPlacement={errorYPlacement}
        />
      )}
    </>
  );
};

export default CreateFolderAction;
