// REPO: @hitchsoftware/react-file-manager
// FILE: src\FileManager\Actions\UploadFile\UploadFile.action.tsx

import { useRef, useState } from "react";
import Button from "../../../components/Button/Button";
import { AiOutlineCloudUpload } from "react-icons/ai";
import UploadItem from "./UploadItem";
import Loader from "../../../components/Loader/Loader";
import { getFileExtension } from "../../../utils/getFileExtension";
import { getDataSize } from "../../../utils/getDataSize";
import "./UploadFile.action.scss";
import { useFileNavigation } from "../../../contexts/FileNavigationContext";
import { useFiles } from "../../../contexts/FilesContext";
import { FileEntity } from "../../../types/FileEntity";
import { mapFileToEntity } from "../../../utils/mapFileToEntity";

interface UploadFileActionProps {
  fileUploadConfig: any;
  maxFileSize?: number;
  acceptedFileTypes?: string;
  onFileUploading: (file: FileEntity, currentFolder: any) => any;
  onFileUploaded: (file: FileEntity, response: any) => void;
}

const UploadFileAction: React.FC<UploadFileActionProps> = ({
  fileUploadConfig,
  maxFileSize,
  acceptedFileTypes,
  onFileUploading,
  onFileUploaded,
}) => {
  const [files, setFiles] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const { currentFolder, currentPathFiles } = useFileNavigation();
  const { onError } = useFiles();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChooseFileKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter") {
      fileInputRef.current?.click();
    }
  };

  const checkFileError = (file: FileEntity): string | undefined => {
    if (acceptedFileTypes) {
      const extError = !acceptedFileTypes?.includes(getFileExtension(file.name) ?? "");
      if (extError) return "File type is not allowed.";
    }

    const fileExists = currentPathFiles.some(
      (item: any) => item.name.toLowerCase() === file.name.toLowerCase() && !item.isDirectory
    );
    if (fileExists) return "File already exists.";

    const sizeError = maxFileSize && file.size !== undefined && file.size > maxFileSize;
    if (sizeError) return `Maximum upload size is ${getDataSize(maxFileSize, 0)}.`;
  };

  const setSelectedFiles = (selectedFiles: File[]) => {
    const mappedFiles = selectedFiles
      .map(mapFileToEntity)
      .filter(
        (item) =>
          !files.some((fileData) => fileData.file.name.toLowerCase() === item.name.toLowerCase())
      );

    if (mappedFiles.length > 0) {
      const newFiles = mappedFiles.map((file) => {
        const appendData = onFileUploading(file, currentFolder);
        const error = checkFileError(file);
        if (error) {
          onError?.(new Error(error));
        }
        return {
          file,
          appendData,
          ...(error && { error }),
        };
      });

      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setSelectedFiles(droppedFiles);
  };

  const handleChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const choosenFiles = Array.from(e.target.files ?? []);
    setSelectedFiles(choosenFiles);
  };

  const handleFileRemove = (index: number) => {
    setFiles((prev) => {
      const newFiles = prev.map((file, i) => {
        if (index === i) {
          return {
            ...file,
            removed: true,
          };
        }
        return file;
      });

      if (newFiles.every((file) => !!file.removed)) return [];
      return newFiles;
    });
  };

  return (
    <div className={`fm-upload-file ${files.length > 0 ? "file-selcted" : ""}`}>
      <div className="select-files">
        <div
          className={`draggable-file-input ${isDragging ? "dragging" : ""}`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
        >
          <div className="input-text">
            <AiOutlineCloudUpload size={30} />
            <span>Drag files to upload</span>
          </div>
        </div>
        <div className="btn-choose-file">
          <Button padding="0" onKeyDown={handleChooseFileKeyDown}>
            <label htmlFor="chooseFile">Choose File</label>
            <input
              ref={fileInputRef}
              type="file"
              id="chooseFile"
              className="choose-file-input"
              onChange={handleChooseFile}
              multiple
              accept={acceptedFileTypes}
            />
          </Button>
        </div>
      </div>
      {files.length > 0 && (
        <div className="files-progress">
          <div className="heading">
            {Object.values(isUploading).some(Boolean) ? (
              <>
                <h2>Uploading</h2>
                <Loader loading={true} className="upload-loading" />
              </>
            ) : (
              <h2>Completed</h2>
            )}
          </div>
          <ul>
            {files.map((fileData, index) => (
              <UploadItem
                index={index}
                key={index}
                fileData={fileData}
                setFiles={setFiles}
                fileUploadConfig={fileUploadConfig}
                setIsUploading={setIsUploading}
                onFileUploaded={(response) => onFileUploaded(fileData.file, response)}
                handleFileRemove={handleFileRemove}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadFileAction;
