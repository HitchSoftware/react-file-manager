// REPO: @hitchsoftware/react-file-manager
// FILE: src/utils/createFolderTree.ts

export interface FileEntity {
  name: string;
  path: string;
  isDirectory: boolean;
  [key: string]: any;
}

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
