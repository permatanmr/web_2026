import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { getUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const userId = await getUserId();

  if (!userId) {
    return (
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">TugasKu</h1>
        <p>Catat tugas kelas, kelompokkan per mata pelajaran, dan jangan lewatkan tenggat.</p>
        <Link href="/login" className="inline-block rounded bg-black px-4 py-2 text-white">
          Mulai
        </Link>
      </section>
    );
  }

  const total = await db.$count(tasks, eq(tasks.userId, userId));
  const selesai = await db.$count(tasks, and(eq(tasks.userId, userId), eq(tasks.done, true)));

  return (
    <section className="space-y-3">
      <h1 className="text-3xl font-bold">Ringkasan</h1>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded border p-4">
          <p className="text-3xl font-bold">{total - selesai}</p>
          <p className="text-gray-600">Tugas belum selesai</p>
        </div>
        <div className="rounded border p-4">
          <p className="text-3xl font-bold">{selesai}</p>
          <p className="text-gray-600">Tugas selesai</p>
        </div>
      </div>
      <Link href="/tasks" className="underline">Lihat semua tugas</Link>
    </section>
  );
}
