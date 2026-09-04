import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// On Vercel Serverless, the lambda filesystem (/var/task) is strictly read-only.
// SQLite requires write access to the directory to create journals, locks, and insert rows.
// We automatically copy the pre-seeded SQLite database to /tmp on serverless cold start.
if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
  try {
    const tmpDbPath = "/tmp/dev.db";
    const candidates = [
      path.join(process.cwd(), "prisma", "dev.db"),
      path.join(process.cwd(), "dev.db"),
      "/var/task/prisma/dev.db",
      "/var/task/dev.db",
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        let shouldCopy = !fs.existsSync(tmpDbPath);
        if (!shouldCopy) {
          try {
            const srcStat = fs.statSync(p);
            const dstStat = fs.statSync(tmpDbPath);
            if (srcStat.mtimeMs > dstStat.mtimeMs || srcStat.size !== dstStat.size) {
              shouldCopy = true;
            }
          } catch {}
        }
        if (shouldCopy) {
          fs.copyFileSync(p, tmpDbPath);
          console.log(`[PRISMA VERCEL] Successfully copied SQLite database from ${p} to ${tmpDbPath}`);
        }
        break;
      }
    }
  } catch (e) {
    console.error("[PRISMA VERCEL ERROR] Failed to copy SQLite DB to /tmp:", e);
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  schemaEnsured?: boolean;
};

const isVercelServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: isVercelServerless
      ? {
          db: {
            url: "file:/tmp/dev.db",
          },
        }
      : undefined,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Self-healing runtime database schema check.
 * Guarantees that columns like `gender` and `avatarColor` exist on SQLite User table
 * even if an older SQLite instance was cached in /tmp.
 */
export async function ensureDbSchema(): Promise<void> {
  if (globalForPrisma.schemaEnsured) return;
  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "User" ADD COLUMN "gender" TEXT DEFAULT 'unspecified';`
    );
  } catch {}
  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "User" ADD COLUMN "avatarColor" TEXT DEFAULT 'cyan';`
    );
  } catch {}
  globalForPrisma.schemaEnsured = true;
}
