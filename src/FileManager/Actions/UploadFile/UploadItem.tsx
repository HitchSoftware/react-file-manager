// REPO: @hitchsoftware/react-file-manager
// FILE: src/FileManager/Actions/UploadFile/UploadItem.tsx

import { AiOutlineClose } from "react-icons/ai";
import Progress from "../../../components/Progress/Progress";
import { getFileExtension } from "../../../utils/getFileExtension";
import { useFileIcons } from "../../../hooks/useFileIcons";
import { FaRegFile } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { getDataSize } from "../../../utils/getDataSize";
import { IoMdRefresh } from "react-icons/io";
import { useFiles } from "../../../contexts/FilesContext";
import { FaRegCheckCircle } from "react-icons/fa";

interface FileData {
  file: File;
  error?: boolean | string;
  removed?: boolean;
  appendData?: Record<string, any>;
}

interface FileUploadConfig {
  url?: string;
  headers?: Record<string, string>;
  method?: "POST" | "PUT";
}

interface UploadItemProps {
  index: number;
  fileData: FileData;
  setFiles: React.Dispatch<React.SetStateAction<FileData[]>>;
  setIsUploading: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  fileUploadConfig?: FileUploadConfig;
  onFileUploaded: (response: any) => void;
  handleFileRemove: (index: number) => void;
}

const UploadItem: React.FC<UploadItemProps> = ({
  index,
  fileData,
  setFiles,
  setIsUploading,
  fileUploadConfig,
  onFileUploaded,
  handleFileRemove,
}) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [isCanceled, setIsCanceled] = useState<boolean>(false);
  const [uploadFailed, setUploadFailed] = useState<boolean>(false);
  const fileIcons = useFileIcons(33);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const { onError } = useFiles();

  const handleUploadError = (xhr: XMLHttpRequest) => {
    setUploadProgress(0);
    setIsUploading((prev) => ({ ...prev, [index]: false }));

    const error = {
      type: "upload",
      message: "Upload failed.",
      response: {
        status: xhr.status,
        statusText: xhr.statusText,
        data: xhr.response,
      },
    };

    setFiles((prev) =>
      prev.map((file, i) => (i === index ? { ...file, error: error.message } : file))
    );

    setUploadFailed(true);
    onError(error, fileData.file);
  };

  const fileUpload = (fileData: FileData) => {
    if (fileData.error) return;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      setIsUploading((prev) => ({ ...prev, [index]: true }));

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        setIsUploading((prev) => ({ ...prev, [index]: false }));

        if (xhr.status === 200 || xhr.status === 201) {
          setIsUploaded(true);
          onFileUploaded(xhr.response);
          resolve(xhr.response);
        } else {
          reject(xhr.statusText);
          handleUploadError(xhr);
        }
      };

      xhr.onerror = () => {
        reject(xhr.statusText);
        handleUploadError(xhr);
      };

      const method = fileUploadConfig?.method || "POST";
      xhr.open(method, fileUploadConfig?.url || "", true);

      const headers = fileUploadConfig?.headers || {};
      for (const key in headers) {
        xhr.setRequestHeader(key, headers[key]);
      }

      const formData = new FormData();
      const appendData = fileData.appendData || {};
      for (const key in appendData) {
        if (appendData[key]) formData.append(key, appendData[key]);
      }
      formData.append("file", fileData.file);

      xhr.send(formData);
    });
  };

  useEffect(() => {
    if (!xhrRef.current) {
      fileUpload(fileData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAbortUpload = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      setIsUploading((prev) => ({ ...prev, [index]: false }));
      setIsCanceled(true);
      setUploadProgress(0);
    }
  };

  const handleRetry = () => {
    if (fileData?.file) {
      setFiles((prev) =>
        prev.map((file, i) => (i === index ? { ...file, error: false } : file))
      );
      fileUpload({ ...fileData, error: false });
      setIsCanceled(false);
      setUploadFailed(false);
    }
  };

  if (fileData.removed) return null;

  return (
    <li>
      <div className="file-icon">
        {fileIcons[getFileExtension(fileData.file?.name ?? "")] ?? <FaRegFile size={33} />}
      </div>
      <div className="file">
        <div className="file-details">
          <div className="file-info">
            <span className="file-name text-truncate" title={fileData.file?.name}>
              {fileData.file?.name}
            </span>
            <span className="file-size">{getDataSize(fileData.file?.size ?? 0)}</span>
          </div>
          {isUploaded ? (
            <FaRegCheckCircle title="Uploaded" className="upload-success" />
          ) : isCanceled || uploadFailed ? (
            <IoMdRefresh className="retry-upload" title="Retry" onClick={handleRetry} />
          ) : (
            <div
              className="rm-file"
              title={fileData.error ? "Remove" : "Abort Upload"}
              onClick={fileData.error ? () => handleFileRemove(index) : handleAbortUpload}
            >
              <AiOutlineClose />
            </div>
          )}
        </div>
        <Progress
          percent={uploadProgress}
          isCanceled={isCanceled}
          isCompleted={isUploaded}
          error={fileData.error}
        />
      </div>
    </li>
  );
};

export default UploadItem;
