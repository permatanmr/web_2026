import { PrismaClient } from "@/app/generated/prisma/client";
import { resolve } from "node:path";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const databaseUrl = process.env.DATABASE_URL;
const clientOptions = databaseUrl?.startsWith("file:./")
  ? {
      datasources: {
        db: {
          url: `file:${resolve(process.cwd(), "prisma", databaseUrl.slice("file:./".length))}`,
        },
      },
    }
  : undefined;

export const prisma = globalForPrisma.prisma ?? new PrismaClient(clientOptions);
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
