// REPO: @hitchsoftware/react-file-manager
// FILE: src/hooks/useFileIcons.tsx

import {
  FaRegFileAudio,
  FaRegFileImage,
  FaRegFileLines,
  FaRegFilePdf,
  FaRegFileVideo,
  FaRegFileWord,
  FaRegFilePowerpoint,
  FaRegFileExcel,
  FaRegFileCode,
  FaLaptopFile,
  FaRegFileZipper,
} from "react-icons/fa6";
import { ReactElement } from "react";

type FileIcons = {
  [key: string]: ReactElement;
};

export const useFileIcons = (size: number): FileIcons => {
  const fileIcons: FileIcons = {
    pdf: <FaRegFilePdf size={size} />,
    jpg: <FaRegFileImage size={size} />,
    jpeg: <FaRegFileImage size={size} />,
    png: <FaRegFileImage size={size} />,
    txt: <FaRegFileLines size={size} />,
    doc: <FaRegFileWord size={size} />,
    docx: <FaRegFileWord size={size} />,
    mp4: <FaRegFileVideo size={size} />,
    webm: <FaRegFileVideo size={size} />,
    mp3: <FaRegFileAudio size={size} />,
    m4a: <FaRegFileAudio size={size} />,
    zip: <FaRegFileZipper size={size} />,
    ppt: <FaRegFilePowerpoint size={size} />,
    pptx: <FaRegFilePowerpoint size={size} />,
    xls: <FaRegFileExcel size={size} />,
    xlsx: <FaRegFileExcel size={size} />,
    exe: <FaLaptopFile size={size} />,
    html: <FaRegFileCode size={size} />,
    css: <FaRegFileCode size={size} />,
    js: <FaRegFileCode size={size} />,
    php: <FaRegFileCode size={size} />,
    py: <FaRegFileCode size={size} />,
    java: <FaRegFileCode size={size} />,
    cpp: <FaRegFileCode size={size} />,
    c: <FaRegFileCode size={size} />,
    ts: <FaRegFileCode size={size} />,
    jsx: <FaRegFileCode size={size} />,
    tsx: <FaRegFileCode size={size} />,
    json: <FaRegFileCode size={size} />,
    xml: <FaRegFileCode size={size} />,
    sql: <FaRegFileCode size={size} />,
    csv: <FaRegFileCode size={size} />,
    md: <FaRegFileCode size={size} />,
    svg: <FaRegFileCode size={size} />,
  };

  return fileIcons;
};
