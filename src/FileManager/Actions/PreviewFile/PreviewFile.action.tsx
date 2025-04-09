// REPO: @hitchsoftware/react-file-manager
// FILE: src/FileManager/Actions/PreviewFile/PreviewFile.action.tsx

import React, { useMemo, useState } from "react";
import { getFileExtension } from "../../../utils/getFileExtension";
import Loader from "../../../components/Loader/Loader";
import Button from "../../../components/Button/Button";
import { getDataSize } from "../../../utils/getDataSize";
import { MdOutlineFileDownload } from "react-icons/md";
import { useFileIcons } from "../../../hooks/useFileIcons";
import { FaRegFileAlt } from "react-icons/fa";
import "./PreviewFile.action.scss";
import { useSelection } from "../../../contexts/SelectionContext";
import { FileEntity } from "../../../types/FileEntity";

const imageExtensions = ["jpg", "jpeg", "png"];
const videoExtensions = ["mp4", "mov", "avi"];
const audioExtensions = ["mp3", "wav", "m4a"];
const iFrameExtensions = ["txt", "pdf"];

interface FilePreviewActionProps {
  filePreviewPath: string;
  filePreviewComponent?: (file: FileEntity) => React.ReactNode;
}

const PreviewFileAction: React.FC<FilePreviewActionProps> = ({
  filePreviewPath,
  filePreviewComponent,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { selectedFiles } = useSelection();
  const fileIcons = useFileIcons(73);
  const file = selectedFiles[0];

  const extension = getFileExtension(file?.name ?? "")?.toLowerCase();
  const filePath = file?.path ? `${filePreviewPath}${file.path}` : "";

  const customPreview = useMemo(() => {
    return filePreviewComponent?.(file);
  }, [filePreviewComponent, file]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleDownload = () => {
    if (filePath) window.location.href = filePath;
  };

  if (React.isValidElement(customPreview)) {
    return <>{customPreview}</>;
  }

  const supportedExtensions = [
    ...imageExtensions,
    ...videoExtensions,
    ...audioExtensions,
    ...iFrameExtensions,
  ];

  return (
    <section className={`file-previewer ${extension === "pdf" ? "pdf-previewer" : ""}`}>
      {hasError || !supportedExtensions.includes(extension ?? "") ? (
        <div className="preview-error">
          <span className="error-icon">
            {extension && fileIcons?.[extension] ? (
              fileIcons[extension]
            ) : (
              <FaRegFileAlt size={73} />
            )}
          </span>

          <span className="error-msg">Sorry! Preview is not available for this file.</span>
          <div className="file-info">
            <span className="file-name">{file?.name}</span>
            {file?.size && <span>-</span>}
            {file?.size !== undefined && (
              <span className="file-size">{getDataSize(file.size)}</span>
            )}
          </div>
          {filePath && (
            <Button onClick={handleDownload} padding="0.45rem .9rem">
              <div className="download-btn">
                <MdOutlineFileDownload size={18} />
                <span>Download</span>
              </div>
            </Button>
          )}
        </div>
      ) : null}

      {imageExtensions.includes(extension ?? "") && filePath && (
        <>
          <Loader loading={isLoading} />
          <img
            src={filePath}
            alt="Preview Unavailable"
            className={`photo-popup-image ${isLoading ? "img-loading" : ""}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        </>
      )}

      {videoExtensions.includes(extension ?? "") && filePath && (
        <video src={filePath} className="video-preview" controls autoPlay />
      )}

      {audioExtensions.includes(extension ?? "") && filePath && (
        <audio src={filePath} controls autoPlay className="audio-preview" />
      )}

      {iFrameExtensions.includes(extension ?? "") && filePath && (
        <iframe
          src={filePath}
          onLoad={handleImageLoad}
          onError={handleImageError}
          frameBorder="0"
          className={`photo-popup-iframe ${isLoading ? "img-loading" : ""}`}
        />
      )}
    </section>
  );
};

export default PreviewFileAction;
