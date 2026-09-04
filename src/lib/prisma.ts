import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  schemaEnsured?: boolean;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Self-healing runtime database schema check.
 * Backfills fields for databases created before these columns were introduced.
 */
export async function ensureDbSchema(): Promise<void> {
  if (globalForPrisma.schemaEnsured) return;
  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "gender" TEXT DEFAULT 'unspecified';`
    );
  } catch {}
  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarColor" TEXT DEFAULT 'cyan';`
    );
  } catch {}
  globalForPrisma.schemaEnsured = true;
}
