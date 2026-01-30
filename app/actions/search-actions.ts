"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function searchFiles(query: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  // If query is empty, return empty array
  if (!query.trim()) return [];
  
  // Use Prisma full text search via client extensions or just simple contains for now if simpler
  // but since we enabled fullTextSearchPostgres ... let's try raw query or just simple contains first for safety
  // The 'fullTextSearchPostgres' feature enables the 'search' operator in findMany.
  
  try {
     const files = await prisma.file.findMany({
        where: {
            userId: user.id,
            name: {
                search: query.split(" ").join(" & "), 
            },
        },
        take: 10,
     });
     return files;
  } catch (e) {
      console.error(e);
      // Fallback to simple contains if search syntax fails or index missing
      return await prisma.file.findMany({
          where: {
              userId: user.id,
              name: {
                  contains: query,
                  mode: "insensitive",
              },
          },
          take: 10,
      });
  }
}
