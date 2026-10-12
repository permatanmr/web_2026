/*
  Warnings:

  - Added the required column `prodi` to the `Mahasiswa` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mahasiswa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "prodi" TEXT NOT NULL
);
INSERT INTO "new_Mahasiswa" ("id", "name") SELECT "id", "name" FROM "Mahasiswa";
DROP TABLE "Mahasiswa";
ALTER TABLE "new_Mahasiswa" RENAME TO "Mahasiswa";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
