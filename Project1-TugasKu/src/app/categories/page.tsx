import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { requireUserId } from "@/lib/session";
import { createCategory, deleteCategory } from "./actions";

export const dynamic = "force-dynamic";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const userId = await requireUserId();
  const { error } = await searchParams;
  const rows = await db.select().from(categories).where(eq(categories.userId, userId));

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Kategori</h1>
      {error && <p className="rounded bg-red-100 p-2 text-red-700">{error}</p>}

      <form action={createCategory} className="flex gap-2">
        <input name="name" placeholder="Nama kategori, mis. Bahasa Indonesia" className="flex-1 rounded border p-2" />
        <button className="rounded bg-black px-4 py-2 text-white">Tambah</button>
      </form>

      <ul className="space-y-2">
        {rows.map((c) => (
          <li key={c.id} className="flex items-center justify-between rounded border p-3">
            <span>{c.name}</span>
            <form action={deleteCategory.bind(null, c.id)}>
              <button className="text-sm text-red-600 underline">Hapus</button>
            </form>
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-500">Menghapus kategori ikut menghapus semua tugas di dalamnya.</p>
    </section>
  );
}
