// REPO: @hitchsoftware/react-file-manager
// FILE: src/utils/sortFiles.ts

import { FileEntity } from "../types/FileEntity";

const sortAscending = (files: FileEntity[]): FileEntity[] =>
  files.sort((a: FileEntity, b: FileEntity) => a.name.localeCompare(b.name));

const sortFiles = (items: FileEntity[]): FileEntity[] => {
  const folders = items.filter((file) => file.isDirectory);
  const files = items.filter((file) => !file.isDirectory);
  const sortedFolders = sortAscending(folders);
  const sortedFiles = sortAscending(files);

  return [...sortedFolders, ...sortedFiles];
};

export default sortFiles;
