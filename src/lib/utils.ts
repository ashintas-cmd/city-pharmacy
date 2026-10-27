export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function inr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function compactNumber(value: number) {
  return new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function formatDate(value: unknown, withTime = false) {
  const date = toDate(value);
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

export function formatDateTime(value: unknown) {
  return formatDate(value, true);
}

export function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "object" && "seconds" in (value as object)) {
    const seconds = (value as { seconds?: number }).seconds;
    return seconds ? new Date(seconds * 1000) : null;
  }
  return null;
}

export function generateOrderNumber(now = new Date()) {
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CP-${yy}${mm}${dd}-${rand}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 70);
}

export function validPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 && /^[6-9]/.test(digits) || (digits.length === 12 && digits.startsWith("91"));
}

export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
}

export function whatsappLink(number: string, text = "") {
  const clean = number.replace(/\D/g, "");
  return `https://wa.me/${clean}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function passwordIssue(password: string) {
  if (password.length < 6) return "Password must be at least 6 characters.";
  return "";
}

export function firebaseErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code: string }).code).replace("auth/", "")
      : "";
  const map: Record<string, string> = {
    "popup-closed-by-user": "Sign-in window was closed. Please try again.",
    "cancelled-popup-request": "Another sign-in is already in progress.",
    "popup-blocked": "Your browser blocked the sign-in popup. Please allow popups and retry.",
    "unauthorized-domain": "This domain is not authorised for Google sign-in yet.",
    "operation-not-allowed": "This sign-in method is not enabled for the project.",
    "invalid-email": "Please enter a valid email address.",
    "user-not-found": "No account found with this email. Please sign up first.",
    "wrong-password": "Incorrect password. Please try again.",
    "invalid-credential": "Incorrect email or password. Please try again.",
    "email-already-in-use": "An account with this email already exists. Please sign in.",
    "weak-password": "Please use a stronger password (at least 6 characters).",
    "too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
    "network-request-failed": "Network error. Please check your connection and retry.",
    "requires-recent-login": "Please sign in again to continue.",
  };
  return map[code] ?? "Something went wrong. Please try again.";
}

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell ?? "");
          return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
        })
        .join(","),
    )
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
