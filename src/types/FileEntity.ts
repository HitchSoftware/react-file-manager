// REPO: @hitchsoftware/react-file-manager
// FILE: src\types\FileEntity.ts

export interface FileEntity {
  id: string;
  name: string;
  path: string;
  isDirectory: boolean;
  date?: string;
  isEditing?: boolean;
  updatedAt?: string;
  size?: number;
  [key: string]: any;
}
