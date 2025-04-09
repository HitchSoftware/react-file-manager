import { FileEntity } from "./FileEntity";

export interface FolderNode extends FileEntity {
  subDirectories?: FolderNode[];
}
