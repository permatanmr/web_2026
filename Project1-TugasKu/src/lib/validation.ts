import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi"),
  description: z.string().trim().optional(),
  dueDate: z.coerce.date().optional(),
  categoryId: z.coerce.number().int().positive("Pilih kategori"),
});

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Nama kategori wajib diisi"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi"),
  email: z.string().trim().toLowerCase().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

// Mengubah string id dari URL menjadi angka, atau null bila tidak valid
export function parseId(value: string): number | null {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}
