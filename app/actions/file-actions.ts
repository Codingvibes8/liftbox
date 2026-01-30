"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function getFiles(folderId: string | null = null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  return await prisma.file.findMany({
    where: {
      userId: user.id,
      folderId: folderId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getFolders(parentFolderId: string | null = null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  return await prisma.folder.findMany({
    where: {
      userId: user.id,
      parentFolderId: parentFolderId,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function createFolder(name: string, parentFolderId: string | null = null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  try {
    await prisma.folder.create({
      data: {
        name,
        userId: user.id,
        parentFolderId,
      },
    });
    revalidatePath("/dashboard/files");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create folder" };
  }
}

export async function deleteFile(fileId: string, path: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Delete from Storage
  const { error: storageError } = await supabase
    .storage
    .from("files")
    .remove([path]);

  if (storageError) {
    console.error("Storage delete error:", storageError);
    // Proceed to delete from reference DB anyway or return error?
    // Often best to try to keep in sync.
  }

  // Delete from DB
  try {
    await prisma.file.delete({
      where: {
        id: fileId,
        userId: user.id, // Ensure ownership
      },
    });
    revalidatePath("/dashboard/files");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete file" };
  }
}

// Called after successful client-side upload
export async function recordFileUpload(fileData: {
  name: string;
  type: string;
  size: number;
  url: string;
  path: string; // Storage path
  folderId: string | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  try {
    await prisma.file.create({
      data: {
        name: fileData.name,
        type: fileData.type,
        size: fileData.size,
        url: fileData.url,
        path: fileData.path,
        folderId: fileData.folderId,
        userId: user.id,
      },
    });
    revalidatePath("/dashboard/files");
    return { success: true };
  } catch (error) {
    // If DB fails, we should technically delete the file from storage to keep sync
    // For now just return error
    console.error(error);
    return { error: "Failed to record file in database" };
  }
}
