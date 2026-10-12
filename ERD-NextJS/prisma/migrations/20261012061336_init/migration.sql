/*
  Warnings:

  - You are about to drop the `Dosen` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Mahasiswa` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Dosen";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Mahasiswa";
PRAGMA foreign_keys=on;
