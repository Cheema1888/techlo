/**
 * Convert Pakistani mobile numbers to the digits-only format required by wa.me.
 * Google account identifiers (for example `google:123...`) are deliberately
 * rejected because they are not phone numbers.
 */
export function normalizeWhatsappNumber(value?: string | null): string | null {
  if (!value || value.trim().toLowerCase().startsWith("google:")) return null;

  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("0092")) digits = digits.slice(2);
  if (/^03\d{9}$/.test(digits)) digits = `92${digits.slice(1)}`;
  if (/^3\d{9}$/.test(digits)) digits = `92${digits}`;

  return /^923\d{9}$/.test(digits) ? digits : null;
}
