import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// File database lokal; DB_URL boleh diganti saat deploy
export const db = drizzle({
  connection: { url: process.env.DB_URL ?? "file:sqlite.db" },
  schema,
});
