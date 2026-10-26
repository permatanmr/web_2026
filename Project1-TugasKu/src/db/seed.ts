import bcrypt from "bcryptjs";
import { db } from "./index";
import { categories, tasks, users } from "./schema";

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const [user] = await db
    .insert(users)
    .values({ name: "Siswa Demo", email: "demo@tugasku.id", passwordHash })
    .returning();

  const [mtk, ipa] = await db
    .insert(categories)
    .values([
      { name: "Matematika", userId: user.id },
      { name: "IPA", userId: user.id },
    ])
    .returning();

  const day = 24 * 60 * 60 * 1000;
  await db.insert(tasks).values([
    { title: "PR Aljabar halaman 42", categoryId: mtk.id, userId: user.id, dueDate: new Date(Date.now() + 2 * day) },
    { title: "Laporan percobaan fotosintesis", categoryId: ipa.id, userId: user.id, dueDate: new Date(Date.now() + 5 * day) },
    { title: "Latihan soal geometri", categoryId: mtk.id, userId: user.id, done: true },
  ]);

  console.log("Seed selesai. Login: demo@tugasku.id / password123");
}

main();
