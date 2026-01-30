export interface FileObject {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  folderId: string | null;
  userId: string;
}

export interface FolderObject {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  parentFolderId: string | null;
}
