// REPO: @hitchsoftware/react-file-manager
// FILE: src\FileManager\Actions\Rename\Rename.action.tsx

import React, { useEffect, useRef, useState } from "react";
import Button from "../../../components/Button/Button";
import { IoWarningOutline } from "react-icons/io5";
import { useDetectOutsideClick } from "../../../hooks/useDetectOutsideClick";
import Modal from "../../../components/Modal/Modal";
import { getFileExtension } from "../../../utils/getFileExtension";
import NameInput from "../../../components/NameInput/NameInput";
import ErrorTooltip from "../../../components/ErrorTooltip/ErrorTooltip";
import { validateApiCallback } from "../../../utils/validateApiCallback";
import { useFileNavigation } from "../../../contexts/FileNavigationContext";
import { useLayout } from "../../../contexts/LayoutContext";
import { FileEntity } from "../../../types/FileEntity";

const maxNameLength = 220;

interface RenameActionProps {
  filesViewRef: React.RefObject<HTMLElement>;
  file: FileEntity;
  onRename: (originalFile: any, newName: string) => void;
  triggerAction: { close: () => void };
}

const RenameAction: React.FC<RenameActionProps> = ({
  filesViewRef,
  file,
  onRename,
  triggerAction,
}) => {
  const [renameFile, setRenameFile] = useState(file?.name);
  const [renameFileWarning, setRenameFileWarning] = useState(false);
  const [fileRenameError, setFileRenameError] = useState(false);
  const [renameErrorMessage, setRenameErrorMessage] = useState("");
  const [errorXPlacement, setErrorXPlacement] = useState<"left" | "right">("right");
  const [errorYPlacement, setErrorYPlacement] = useState<"top" | "bottom">("bottom");
  const { currentPathFiles, setCurrentPathFiles } = useFileNavigation();
  const { activeLayout } = useLayout();

  const warningModalRef = useRef<HTMLDivElement>(null);
  const outsideClick = useDetectOutsideClick((e: MouseEvent | TouchEvent) => {
    if (!warningModalRef.current?.contains(e.target as Node)) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }
  });

  const handleValidateFolderRename = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      e.preventDefault();
      outsideClick.setIsClicked(true);
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setCurrentPathFiles((prev: any[]) =>
        prev.map((f) => {
          if (f.key === file.key) {
            f.isEditing = false;
          }
          return f;
        })
      );
      triggerAction.close();
      return;
    }

    const invalidCharsRegex = /[\\/:*?"<>|]/;
    if (invalidCharsRegex.test(e.key)) {
      e.preventDefault();
      setRenameErrorMessage(
        "A file name can't contain any of the following characters: \\ / : * ? \" < > |"
      );
      setFileRenameError(true);
    } else {
      setFileRenameError(false);
    }
  };

  useEffect(() => {
    if (fileRenameError) {
      const autoHideError = setTimeout(() => {
        setFileRenameError(false);
        setRenameErrorMessage("");
      }, 7000);

      return () => clearTimeout(autoHideError);
    }
  }, [fileRenameError]);

  function handleFileRenaming(isConfirmed: boolean) {
    if (renameFile === "" || renameFile === file.name) {
      setCurrentPathFiles((prev: any[]) =>
        prev.map((f) => {
          if (f.key === file.key) {
            f.isEditing = false;
          }
          return f;
        })
      );
      triggerAction.close();
      return;
    } else if (currentPathFiles.some((f: any) => f.name === renameFile)) {
      setFileRenameError(true);
      setRenameErrorMessage(`This destination already contains a folder named '${renameFile}'.`);
      outsideClick.setIsClicked(false);
      return;
    } else if (!file.isDirectory && !isConfirmed) {
      const fileExtension = getFileExtension(file.name);
      const renameFileExtension = getFileExtension(renameFile);
      if (fileExtension !== renameFileExtension) {
        setRenameFileWarning(true);
        return;
      }
    }

    setFileRenameError(false);
    validateApiCallback(onRename, "onRename", file, renameFile);
    setCurrentPathFiles((prev: any[]) => prev.filter((f) => f.key !== file.key));
    triggerAction.close();
  }

  const focusName = () => {
    const ref = outsideClick.ref.current as HTMLTextAreaElement | null;
    ref?.focus();

    if (file.isDirectory) {
      ref?.select();
    } else {
      const fileExtension = getFileExtension(file.name);
      const fileNameLength = file.name.length - (fileExtension ? fileExtension.length - 1 : 0);
      ref?.setSelectionRange(0, fileNameLength);
    }
  };

  useEffect(() => {
    focusName();

    if (outsideClick.ref?.current && filesViewRef.current) {
      const errorMessageWidth = 313;
      const errorMessageHeight = 88;
      const filesContainerRect = filesViewRef.current.getBoundingClientRect();
      const inputRect = outsideClick.ref.current.getBoundingClientRect();

      const rightSpace = filesContainerRect.right - inputRect.left;
      setErrorXPlacement(rightSpace > errorMessageWidth ? "right" : "left");

      const bottomSpace = filesContainerRect.bottom - (inputRect.top + inputRect.height);
      setErrorYPlacement(bottomSpace > errorMessageHeight ? "bottom" : "top");
    }
  }, []);

  useEffect(() => {
    if (outsideClick.isClicked) {
      handleFileRenaming(false);
    }
    focusName();
  }, [outsideClick.isClicked]);

  return (
    <>
      <NameInput
        nameInputRef={outsideClick.ref as React.RefObject<HTMLTextAreaElement>}
        maxLength={maxNameLength}
        value={renameFile}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setRenameFile(e.target.value);
          setFileRenameError(false);
        }}
        onKeyDown={handleValidateFolderRename}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        {...(activeLayout === "list" && { rows: 1 })}
      />
      {fileRenameError && (
        <ErrorTooltip
          message={renameErrorMessage}
          xPlacement={errorXPlacement}
          yPlacement={errorYPlacement}
        />
      )}

      <Modal
        heading={"Rename"}
        show={renameFileWarning}
        setShow={setRenameFileWarning}
        dialogWidth={"25vw"}
        closeButton={false}
      >
        <div className="fm-rename-folder-container" ref={warningModalRef}>
          <div className="fm-rename-folder-input">
            <div className="fm-rename-warning">
              <IoWarningOutline size={70} color="orange" />
              <div>
                If you change a file name extension, the file might become unusable. Are you sure
                you want to change it?
              </div>
            </div>
          </div>
          <div className="fm-rename-folder-action">
            <Button
              type="secondary"
              onClick={() => {
                setCurrentPathFiles((prev: any[]) =>
                  prev.map((f) => {
                    if (f.key === file.key) {
                      f.isEditing = false;
                    }
                    return f;
                  })
                );
                setRenameFileWarning(false);
                triggerAction.close();
              }}
            >
              No
            </Button>
            <Button
              type="danger"
              onClick={() => {
                setRenameFileWarning(false);
                handleFileRenaming(true);
              }}
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RenameAction;
