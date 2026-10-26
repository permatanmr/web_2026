import Link from "next/link";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <form action={login} className="mx-auto max-w-sm space-y-3">
      <h1 className="text-2xl font-bold">Masuk</h1>
      {error && <p className="rounded bg-red-100 p-2 text-red-700">{error}</p>}
      <input name="email" type="email" placeholder="Email" className="w-full rounded border p-2" />
      <input name="password" type="password" placeholder="Password" className="w-full rounded border p-2" />
      <button className="w-full rounded bg-black px-4 py-2 text-white">Masuk</button>
      <p className="text-sm">
        Belum punya akun? <Link href="/register" className="underline">Daftar</Link>
      </p>
    </form>
  );
}
