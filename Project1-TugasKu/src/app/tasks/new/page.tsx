import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { requireUserId } from "@/lib/session";
import { createTask } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewTaskPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const userId = await requireUserId();
  const { error } = await searchParams;
  const cats = await db.select().from(categories).where(eq(categories.userId, userId));

  if (cats.length === 0) {
    return (
      <p>
        Buat kategori dulu di halaman <a href="/categories" className="underline">Kategori</a>.
      </p>
    );
  }

  return (
    <form action={createTask} className="space-y-3">
      <h1 className="text-2xl font-bold">Tugas Baru</h1>
      {error && <p className="rounded bg-red-100 p-2 text-red-700">{error}</p>}
      <input name="title" placeholder="Judul tugas" className="w-full rounded border p-2" />
      <textarea name="description" placeholder="Deskripsi (opsional)" className="w-full rounded border p-2" />
      <select name="categoryId" className="w-full rounded border p-2">
        {cats.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <input name="dueDate" type="date" className="w-full rounded border p-2" />
      <button className="rounded bg-black px-4 py-2 text-white">Simpan</button>
    </form>
  );
}
