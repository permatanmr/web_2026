import type { Metadata } from "next";
import Link from "next/link";
import { getUserId } from "@/lib/session";
import { logout } from "./login/actions";
import "./globals.css";

export const metadata: Metadata = {
  title: "TugasKu",
  description: "Pencatat tugas kelas",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const userId = await getUserId();

  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <nav className="flex items-center gap-4 border-b p-4">
          <Link href="/" className="font-bold">TugasKu</Link>
          {userId ? (
            <>
              <Link href="/tasks">Tugas</Link>
              <Link href="/categories">Kategori</Link>
              <form action={logout} className="ml-auto">
                <button className="text-sm underline">Keluar</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="ml-auto">Masuk</Link>
              <Link href="/register">Daftar</Link>
            </>
          )}
        </nav>
        <main className="mx-auto w-full max-w-3xl p-4">{children}</main>
      </body>
    </html>
  );
}
