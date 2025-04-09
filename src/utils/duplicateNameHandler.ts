// REPO: @hitchsoftware/react-file-manager
// FILE: src/utils/duplicateNameHandler.ts

export interface FileEntity {
  name: string;
  isDirectory: boolean;
  [key: string]: any;
}

export const duplicateNameHandler = (
  originalFileName: string,
  isDirectory: boolean,
  files: FileEntity[]
): string => {
  if (files.find((f: FileEntity) => f.name === originalFileName)) {
    const fileExtension = isDirectory ? "" : "." + originalFileName.split(".").pop();
    const fileName = isDirectory
      ? originalFileName
      : originalFileName.split(".").slice(0, -1).join(".");

    let maxFileNum = 0;
    const fileNameRegex = new RegExp(`${fileName} \\(\\d+\\)`);

    files.forEach((f: FileEntity) => {
      const fName = f.isDirectory ? f.name : f.name.split(".").slice(0, -1).join(".");
      if (fileNameRegex.test(fName)) {
        const fileNumStr = fName.split(`${fileName} (`).pop()?.slice(0, -1);
        const fileNum = parseInt(fileNumStr || "");
        if (!isNaN(fileNum) && fileNum > maxFileNum) {
          maxFileNum = fileNum;
        }
      }
    });

    const appendNum = ` (${++maxFileNum})`;
    return fileName + appendNum + fileExtension;
  } else {
    return originalFileName;
  }
};
