import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { requireUserId } from "@/lib/session";
import DoneButton from "./DoneButton";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const userId = await requireUserId();
  const rows = await db.query.tasks.findMany({
    where: eq(tasks.userId, userId),
    with: { category: true },
    orderBy: desc(tasks.createdAt),
  });

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Daftar Tugas</h1>
        <Link href="/tasks/new" className="rounded bg-black px-3 py-2 text-sm text-white">
          Tambah tugas
        </Link>
      </div>

      {rows.length === 0 && (
        <p className="mt-6 text-gray-500">Belum ada tugas. Klik &quot;Tambah tugas&quot;.</p>
      )}

      <ul className="mt-4 space-y-3">
        {rows.map((t) => (
          <li key={t.id} className="flex items-center justify-between rounded border p-3">
            <div>
              <Link href={`/tasks/${t.id}`} className="font-semibold underline">
                {t.title}
              </Link>
              <p className="text-sm text-gray-600">
                {t.category.name}
                {t.dueDate ? ` · tenggat ${t.dueDate.toLocaleDateString("id-ID")}` : ""}
                {t.done ? " · selesai" : ""}
              </p>
            </div>
            <DoneButton id={t.id} done={t.done} />
          </li>
        ))}
      </ul>
    </section>
  );
}
