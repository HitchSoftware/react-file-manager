import { FileEntity } from "../types/FileEntity";

export function mapFileToEntity(file: File): FileEntity {
  return {
    id: crypto.randomUUID(), // or use another unique ID strategy
    name: file.name,
    path: "", // You could fill this in from `currentFolder.path` if needed
    isDirectory: false,
    size: file.size,
    updatedAt: new Date().toISOString(),
    file, // optional: store original File object if needed
  };
}
