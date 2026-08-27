export function slugify(value: string, fallback = "workspace"): string {
  const slug = value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  return slug || fallback;
}

export function entitySlug(name: string, id: string): string {
  return `${slugify(name)}-${id.slice(-8).toLowerCase()}`;
}
