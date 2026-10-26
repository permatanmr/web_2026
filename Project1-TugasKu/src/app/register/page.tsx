import Link from "next/link";
import { register } from "../login/actions";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <form action={register} className="mx-auto max-w-sm space-y-3">
      <h1 className="text-2xl font-bold">Daftar</h1>
      {error && <p className="rounded bg-red-100 p-2 text-red-700">{error}</p>}
      <input name="name" placeholder="Nama" className="w-full rounded border p-2" />
      <input name="email" type="email" placeholder="Email" className="w-full rounded border p-2" />
      <input name="password" type="password" placeholder="Password (min. 8 karakter)" className="w-full rounded border p-2" />
      <button className="w-full rounded bg-black px-4 py-2 text-white">Daftar</button>
      <p className="text-sm">
        Sudah punya akun? <Link href="/login" className="underline">Masuk</Link>
      </p>
    </form>
  );
}
