import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { getUserId } from "@/lib/session";
import { parseId } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Ctx) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Belum login" }, { status: 401 });

  const id = parseId((await params).id);
  const deleted = id
    ? await db
        .delete(categories)
        .where(and(eq(categories.id, id), eq(categories.userId, userId)))
        .returning()
    : [];
  if (deleted.length === 0) {
    return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
  }
  return new Response(null, { status: 204 });
}
