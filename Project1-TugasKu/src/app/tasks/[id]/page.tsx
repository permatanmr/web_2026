import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { requireUserId } from "@/lib/session";
import { parseId } from "@/lib/validation";
import { deleteTask } from "../actions";
import DoneButton from "../DoneButton";

export const dynamic = "force-dynamic";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await requireUserId();
  const id = parseId((await params).id);
  if (!id) notFound();

  const task = await db.query.tasks.findFirst({
    where: and(eq(tasks.id, id), eq(tasks.userId, userId)),
    with: { category: true },
  });
  if (!task) notFound();

  return (
    <section className="space-y-3">
      <Link href="/tasks" className="text-sm underline">&larr; Semua tugas</Link>
      <h1 className="text-2xl font-bold">{task.title}</h1>
      <p className="text-gray-600">
        Kategori: {task.category.name} · Status: {task.done ? "selesai" : "belum selesai"}
        {task.dueDate ? ` · Tenggat: ${task.dueDate.toLocaleDateString("id-ID")}` : ""}
      </p>
      {task.description && <p>{task.description}</p>}
      <div className="flex gap-2">
        <DoneButton id={task.id} done={task.done} />
        <form action={deleteTask.bind(null, task.id)}>
          <button className="rounded border border-red-600 px-3 py-1 text-sm text-red-600">
            Hapus
          </button>
        </form>
      </div>
    </section>
  );
}
