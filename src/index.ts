// REPO: @hitchsoftware/react-file-manager
// FILE: src\index.ts

import { applyAutoTheme } from "./styles/initTheme";

applyAutoTheme();

export { FileManager } from "./FileManager/FileManager";
export { useFileNavigation } from "./contexts/FileNavigationContext";
export type { FileManagerProps } from "./FileManager/FileManager";
export type { FileUploadConfig } from "./FileManager/Actions/UploadFile/UploadItem";
export type { FileEntity } from "./types/FileEntity";

