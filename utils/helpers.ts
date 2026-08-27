export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function initials(value: string, fallback = "PC") {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return fallback;
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

export function safeNextPath(value: string | null | undefined, fallback = "/dashboard") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

export function maskIp(value: string) {
  if (!value) return "Unavailable";
  if (value.includes(":")) {
    const parts = value.split(":").filter(Boolean);
    return `${parts.slice(0, 2).join(":")}:••••:••••`;
  }
  const parts = value.split(".");
  if (parts.length !== 4) return value;
  return `${parts[0]}.${parts[1]}.•••.•••`;
}

export function sanitizeText(value: unknown, maxLength = 2000) {
  return String(value ?? "").replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, maxLength);
}

export function asBoolean(value: unknown) {
  return value === true || value === "true" || value === "1" || value === 1;
}
