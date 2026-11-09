import { SITE_EMAIL } from "@/lib/constants";

/**
 * Founder and workshop admin emails allowed to access /admin.
 * Additional comma-separated addresses can be supplied via ADMIN_EMAILS.
 */
export const DEFAULT_ADMIN_EMAILS = [
  "thinulhansana@gmail.com",
  SITE_EMAIL.toLowerCase(),
] as const;

export function getAllowedAdminEmails(extraCsv?: string | null): Set<string> {
  const allowed = new Set<string>(
    DEFAULT_ADMIN_EMAILS.map((email) => email.trim().toLowerCase())
  );

  if (extraCsv) {
    for (const token of extraCsv.split(/[,;\s]+/)) {
      const normalized = token.trim().toLowerCase();
      if (normalized && normalized.includes("@")) {
        allowed.add(normalized);
      }
    }
  }

  return allowed;
}

export function isAdminEmail(
  email?: string | null,
  extraCsv?: string | null
): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  return getAllowedAdminEmails(extraCsv).has(normalized);
}

