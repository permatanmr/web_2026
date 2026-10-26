"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, deleteSession } from "@/lib/session";
import { loginSchema, registerSchema } from "@/lib/validation";

export async function register(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    redirect(`/register?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const { name, email, password } = parsed.data;
  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) {
    redirect(`/register?error=${encodeURIComponent("Email sudah terdaftar")}`);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db.insert(users).values({ name, email, passwordHash }).returning();
  await createSession(user.id);
  redirect("/tasks");
}

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    redirect(`/login?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const user = await db.query.users.findFirst({ where: eq(users.email, parsed.data.email) });
  const valid = user && (await bcrypt.compare(parsed.data.password, user.passwordHash));
  if (!user || !valid) {
    redirect(`/login?error=${encodeURIComponent("Email atau password salah")}`);
  }

  await createSession(user.id);
  redirect("/tasks");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
