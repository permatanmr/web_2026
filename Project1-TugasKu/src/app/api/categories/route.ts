import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { getUserId } from "@/lib/session";
import { categorySchema } from "@/lib/validation";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Belum login" }, { status: 401 });

  const rows = await db.select().from(categories).where(eq(categories.userId, userId));
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Belum login" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.issues }, { status: 400 });
  }

  const [category] = await db
    .insert(categories)
    .values({ name: parsed.data.name, userId })
    .returning();
  return NextResponse.json(category, { status: 201 });
}
