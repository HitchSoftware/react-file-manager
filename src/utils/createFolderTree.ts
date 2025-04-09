// REPO: @hitchsoftware/react-file-manager
// FILE: src/utils/createFolderTree.ts

import { FileEntity } from "../types/FileEntity";

export interface FolderTree extends FileEntity {
  children?: FolderTree[];
}

export const createFolderTree = (
  copiedFile: FileEntity,
  files: FileEntity[]
): FolderTree => {
  const childFiles = files.filter(
    (f: FileEntity) => f.path === `${copiedFile.path}/${copiedFile.name}`
  );

  return {
    ...copiedFile,
    children: childFiles.map((f: FileEntity) => createFolderTree(f, files)),
  };
};
