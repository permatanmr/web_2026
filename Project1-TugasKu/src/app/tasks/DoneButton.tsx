"use client";

import { useTransition } from "react";
import { toggleDone } from "./actions";

export default function DoneButton({ id, done }: { id: number; done: boolean }) {
  const [pending, start] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => start(() => toggleDone(id, !done))}
      className="rounded border px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50"
    >
      {done ? "Batalkan selesai" : "Tandai selesai"}
    </button>
  );
}
