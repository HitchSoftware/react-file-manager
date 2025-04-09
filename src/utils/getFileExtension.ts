// REPO: @hitchsoftware/react-file-manager
// FILE: src\utils\getFileExtension.ts

export const getFileExtension = (fileName: string) => {
  return fileName.split(".").pop();
};
