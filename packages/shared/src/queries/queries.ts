export type QueryPrimitive = string | number | boolean | null | undefined;
export type QueryRecord = Readonly<Record<string, QueryPrimitive | ReadonlyArray<QueryPrimitive>>>;

export function buildQuery(input: QueryRecord): string {
  const params = new URLSearchParams();
  for (const [key, raw] of Object.entries(input)) {
    const values = Array.isArray(raw) ? raw : [raw];
    for (const value of values) {
      if (value === null || value === undefined || value === "") continue;
      params.append(key, String(value));
    }
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function withQuery(path: string, query: QueryRecord): string {
  return `${path}${buildQuery(query)}`;
}
