import Link from "next/link";

export default function NotFound() {
  return (
    <section>
      <h1 className="text-xl font-bold">Tugas tidak ditemukan</h1>
      <Link href="/tasks" className="underline">Kembali ke daftar tugas</Link>
    </section>
  );
}
