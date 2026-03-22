// ─────────────────────────────────────────────────────────────────────────────
// Shared validation utilities
// Used in both client components (real-time) and server actions (final check).
// ─────────────────────────────────────────────────────────────────────────────

/** Returns an error string, or null if valid. */

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email address is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return "Enter a valid email address.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return null;
}

export function validatePasswordMatch(
  password: string,
  confirm: string
): string | null {
  if (password !== confirm) return "Passwords do not match.";
  return null;
}

/**
 * Phone validation.
 * Accepts international formats: +233241234567, 0241234567, +1 (555) 000-0000, etc.
 * Strips spaces / dashes / parens then checks digit count (7–15).
 */
export function validatePhone(phone: string): string | null {
  if (!phone.trim()) return "Phone number is required.";
  const digits = phone.replace(/[\s\-\(\)\+]/g, "");
  if (!/^\d{7,15}$/.test(digits))
    return "Enter a valid phone number (e.g. +233 24 000 0000).";
  return null;
}

export function validateRequired(value: string, label: string): string | null {
  if (!value.trim()) return `${label} is required.`;
  return null;
}

export function validateMinLength(
  value: string,
  min: number,
  label: string
): string | null {
  if (value.trim().length < min)
    return `${label} must be at least ${min} characters.`;
  return null;
}

export function validateMaxLength(
  value: string,
  max: number,
  label: string
): string | null {
  if (value.trim().length > max)
    return `${label} must be ${max} characters or fewer.`;
  return null;
}
