"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { categories, tasks } from "@/db/schema";
import { requireUserId } from "@/lib/session";
import { taskSchema } from "@/lib/validation";

export async function createTask(formData: FormData) {
  const userId = await requireUserId();

  const parsed = taskSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? "") || undefined,
    dueDate: String(formData.get("dueDate") ?? "") || undefined,
    categoryId: formData.get("categoryId"),
  });
  if (!parsed.success) {
    redirect(`/tasks/new?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  // Pastikan kategori milik pengguna yang sedang login
  const category = await db.query.categories.findFirst({
    where: and(eq(categories.id, parsed.data.categoryId), eq(categories.userId, userId)),
  });
  if (!category) {
    redirect(`/tasks/new?error=${encodeURIComponent("Kategori tidak ditemukan")}`);
  }

  await db.insert(tasks).values({ ...parsed.data, userId });
  revalidatePath("/tasks");
  redirect("/tasks");
}

export async function toggleDone(id: number, done: boolean) {
  const userId = await requireUserId();
  await db
    .update(tasks)
    .set({ done })
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  revalidatePath("/tasks");
  revalidatePath(`/tasks/${id}`);
}

export async function deleteTask(id: number) {
  const userId = await requireUserId();
  await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  revalidatePath("/tasks");
  redirect("/tasks");
}
