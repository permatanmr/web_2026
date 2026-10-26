# TugasKu

Aplikasi pencatat tugas kelas: Next.js 16 (App Router), TypeScript, Tailwind CSS, Drizzle ORM + SQLite, Zod, login dengan cookie sesi.

## Menjalankan

Syarat: Node.js 20.9 atau lebih baru.

```bash
npm install
cp .env.example .env        # lalu isi SESSION_SECRET (mis. hasil: openssl rand -base64 32)
npm run db:generate         # membuat file migrasi dari src/db/schema.ts
npm run db:migrate          # membuat tabel di sqlite.db
npm run db:seed             # data contoh: demo@tugasku.id / password123
npm run dev                 # buka http://localhost:3000
```

## Struktur

- `src/db` skema, koneksi, dan seed database
- `src/lib` validasi Zod dan sesi login
- `src/app/api` Route Handler (API JSON)
- `src/app/tasks`, `categories`, `login`, `register` halaman dan Server Action

## Perintah berguna

- `npm run db:studio` melihat isi database di browser
- `npm run build` dan `npm run start` untuk mode produksi
