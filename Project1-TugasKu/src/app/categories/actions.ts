"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { requireUserId } from "@/lib/session";
import { categorySchema } from "@/lib/validation";

export async function createCategory(formData: FormData) {
  const userId = await requireUserId();
  const parsed = categorySchema.safeParse({ name: String(formData.get("name") ?? "") });
  if (!parsed.success) {
    redirect(`/categories?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }
  await db.insert(categories).values({ name: parsed.data.name, userId });
  revalidatePath("/categories");
  redirect("/categories");
}

export async function deleteCategory(id: number) {
  const userId = await requireUserId();
  await db.delete(categories).where(and(eq(categories.id, id), eq(categories.userId, userId)));
  revalidatePath("/categories");
  revalidatePath("/tasks");
}
