export const ADMIN_EMAIL = "cheema@arix.pk";

/**
 * Checks whether an email address belongs to the authorized platform administrator.
 */
export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email || typeof email !== "string") return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
