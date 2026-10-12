"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
export async function createPost(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const content = String(formData.get("content") ?? "");
  const email = String(formData.get("authorEmail") ?? "");
  const author = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name: email.split("@")[0], email },
  });
  await prisma.post.create({
    data: { title, content, authorId: author.id },
  });
  revalidatePath("/");
}

export async function createComment(formData: FormData) {
  const body = String(formData.get("body") ?? "").trim();
  const email = String(formData.get("authorEmail") ?? "").trim();
  const postId = Number(formData.get("postId"));

  if (!body || !email.includes("@") || !Number.isInteger(postId) || postId < 1) {
    return;
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });
  if (!post) return;

  const author = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name: email.split("@")[0] || "Pembaca", email },
  });

  await prisma.comment.create({
    data: { body, postId, authorId: author.id },
  });
  revalidatePath("/");
}
