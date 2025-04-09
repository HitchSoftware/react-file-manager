export interface FileEntity {
  id: string;
  name: string;
  path: string;
  isDirectory: boolean;
  isEditing?: boolean;
  updatedAt?: string;
  size?: number;
  [key: string]: any;
}
