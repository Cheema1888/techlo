import crypto from "crypto";

const KEY_LENGTH = 64;
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export function validatePassword(password: unknown): string | null {
  if (typeof password !== "string" || password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (password.length > 128) {
    return "Password must be 128 characters or fewer";
  }
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return "Password must include at least one letter and one number";
  }
  return null;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password, salt, KEY_LENGTH, SCRYPT_OPTIONS);
  return `scrypt$${SCRYPT_OPTIONS.N}$${SCRYPT_OPTIONS.r}$${SCRYPT_OPTIONS.p}$${salt.toString("base64url")}$${derived.toString("base64url")}`;
}

export function verifyPassword(password: string, storedHash: string): {
  valid: boolean;
  legacy: boolean;
} {
  try {
    if (!storedHash.startsWith("scrypt$")) {
      const supplied = Buffer.from(password);
      const stored = Buffer.from(storedHash);
      return {
        valid: supplied.length === stored.length && crypto.timingSafeEqual(supplied, stored),
        legacy: true,
      };
    }

    const [, nValue, rValue, pValue, saltValue, hashValue] = storedHash.split("$");
    const expected = Buffer.from(hashValue, "base64url");
    const actual = crypto.scryptSync(password, Buffer.from(saltValue, "base64url"), expected.length, {
      N: Number(nValue),
      r: Number(rValue),
      p: Number(pValue),
      maxmem: 64 * 1024 * 1024,
    });
    return {
      valid: actual.length === expected.length && crypto.timingSafeEqual(actual, expected),
      legacy: false,
    };
  } catch {
    return { valid: false, legacy: false };
  }
}
