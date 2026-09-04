import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "techlo-pakistan-secure-secret-token-key-2026";
const COOKIE_NAME = "techlo_session";
const SESSION_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface SessionUser {
  userId: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf8");
}

/**
 * Creates a signed HS256 JWT session token
 */
export function createSessionToken(user: { id: string; email?: string; phoneNumber?: string; role?: string }): string {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(
    JSON.stringify({
      userId: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role || "STUDENT",
      iat: now,
      exp: now + SESSION_EXPIRY_SECONDS,
    })
  );

  const signature = base64UrlEncode(
    crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${payload}`).digest("base64")
  );

  return `${header}.${payload}.${signature}`;
}

/**
 * Verifies an HS256 JWT session token and returns the payload if valid and unexpired
 */
export function verifySessionToken(token: string): SessionUser | null {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const expectedSignature = base64UrlEncode(
      crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${payload}`).digest("base64")
    );

    if (signature !== expectedSignature) {
      return null;
    }

    const decodedPayload = JSON.parse(base64UrlDecode(payload)) as SessionUser;
    const now = Math.floor(Date.now() / 1000);
    if (decodedPayload.exp && decodedPayload.exp < now) {
      return null; // Expired
    }

    return decodedPayload;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the authenticated user from the request's HttpOnly cookie or Authorization header
 */
export function getServerSession(req: NextRequest): SessionUser | null {
  // 1. Check HttpOnly cookie
  const cookieToken = req.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken) {
    const session = verifySessionToken(cookieToken);
    if (session) return session;
  }

  // 2. Check Authorization Bearer header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const headerToken = authHeader.substring(7).trim();
    const session = verifySessionToken(headerToken);
    if (session) return session;
  }

  return null;
}

/**
 * Attaches the signed session cookie to an outgoing NextResponse
 */
export function attachSessionCookie(res: NextResponse, user: { id: string; email?: string; phoneNumber?: string; role?: string }): void {
  const token = createSessionToken(user);
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_EXPIRY_SECONDS,
  });
}

/**
 * Clears the session cookie on logout
 */
export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
