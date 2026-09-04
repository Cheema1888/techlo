import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// On Vercel Serverless, the lambda filesystem (/var/task) is strictly read-only.
// SQLite requires write access to the directory to create journals, locks, and insert rows.
// We automatically copy the pre-seeded SQLite database to /tmp on serverless cold start.
if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
  try {
    const tmpDbPath = "/tmp/dev.db";
    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), "prisma", "dev.db"),
        path.join(process.cwd(), "dev.db"),
        "/var/task/prisma/dev.db",
      ];
      for (const p of candidates) {
        if (fs.existsSync(p)) {
          fs.copyFileSync(p, tmpDbPath);
          console.log(`[PRISMA VERCEL] Successfully copied SQLite database from ${p} to ${tmpDbPath}`);
          break;
        }
      }
    }
  } catch (e) {
    console.error("[PRISMA VERCEL ERROR] Failed to copy SQLite DB to /tmp:", e);
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
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
