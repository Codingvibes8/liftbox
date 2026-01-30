"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    // Sync user to Prisma
     await prisma.user.upsert({
      where: { email: data.user.email! },
      update: {
        updatedAt: new Date(),
      },
      create: {
        id: data.user.id,
        email: data.user.email!,
        fullName: data.user.user_metadata.full_name || email.split("@")[0], // Fallback name
      },
    });
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const origin = (await headers()).get("origin");

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
     console.error(error)
     return { error: error.message };
  }

  if (data.user) {
      // Create user in Prisma immediately if not waiting for email confirmation
      // OR wait for the callback verification. Supabase usually calls callback on email link click.
      // If email confirmation is disabled, we can sync here.
      // For safety, let's sync here too, worst case it duplicates upsert logic.
       await prisma.user.upsert({
        where: { email: data.user.email! },
        update: {
          fullName: fullName,
          updatedAt: new Date(),
        },
        create: {
          id: data.user.id,
          email: data.user.email!,
          fullName: fullName,
        },
      });
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}
