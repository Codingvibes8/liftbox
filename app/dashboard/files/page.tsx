import { getFiles, getFolders } from "@/app/actions/file-actions";
import { FileBrowser } from "@/components/dashboard/file-browser";

export default async function FilesPage() {
  const [files, folders] = await Promise.all([
    getFiles(),
    getFolders(),
  ]);

  return (
    <div>
      <FileBrowser initialFiles={files} initialFolders={folders} />
    </div>
  );
}
