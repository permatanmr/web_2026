import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories, tasks } from "@/db/schema";
import { getUserId } from "@/lib/session";
import { taskSchema } from "@/lib/validation";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Belum login" }, { status: 401 });

  const rows = await db.query.tasks.findMany({
    where: eq(tasks.userId, userId),
    with: { category: true },
    orderBy: desc(tasks.createdAt),
  });
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Belum login" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = taskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.issues }, { status: 400 });
  }

  // Kategori harus milik pengguna yang sama
  const category = await db.query.categories.findFirst({
    where: eq(categories.id, parsed.data.categoryId),
  });
  if (!category || category.userId !== userId) {
    return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 400 });
  }

  const [task] = await db
    .insert(tasks)
    .values({ ...parsed.data, userId })
    .returning();
  return NextResponse.json(task, { status: 201 });
}
