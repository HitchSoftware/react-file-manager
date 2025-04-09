// REPO: @hitchsoftware/react-file-manager
// FILE: src/utils/sortFiles.ts

interface FileItem {
  name: string;
  isDirectory: boolean;
}

const sortAscending = (files: FileItem[]): FileItem[] =>
  files.sort((a: FileItem, b: FileItem) => a.name.localeCompare(b.name));

const sortFiles = (items: FileItem[]): FileItem[] => {
  const folders = items.filter((file) => file.isDirectory);
  const files = items.filter((file) => !file.isDirectory);
  const sortedFolders = sortAscending(folders);
  const sortedFiles = sortAscending(files);

  return [...sortedFolders, ...sortedFiles];
};

export default sortFiles;
