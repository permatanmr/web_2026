import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { getUserId } from "@/lib/session";
import { parseId } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Belum login" }, { status: 401 });

  const id = parseId((await params).id);
  const task = id
    ? await db.query.tasks.findFirst({
        where: and(eq(tasks.id, id), eq(tasks.userId, userId)),
        with: { category: true },
      })
    : null;
  if (!task) return NextResponse.json({ error: "Tugas tidak ditemukan" }, { status: 404 });
  return NextResponse.json(task);
}

export async function PATCH(request: Request, { params }: Ctx) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Belum login" }, { status: 401 });

  const id = parseId((await params).id);
  const body = await request.json().catch(() => null);
  if (!id || typeof body?.done !== "boolean") {
    return NextResponse.json({ error: "Kirim { \"done\": true | false }" }, { status: 400 });
  }

  const [task] = await db
    .update(tasks)
    .set({ done: body.done })
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .returning();
  if (!task) return NextResponse.json({ error: "Tugas tidak ditemukan" }, { status: 404 });
  return NextResponse.json(task);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Belum login" }, { status: 401 });

  const id = parseId((await params).id);
  const deleted = id
    ? await db
        .delete(tasks)
        .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
        .returning()
    : [];
  if (deleted.length === 0) {
    return NextResponse.json({ error: "Tugas tidak ditemukan" }, { status: 404 });
  }
  return new Response(null, { status: 204 });
}
