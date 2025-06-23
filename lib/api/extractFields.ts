export function extractFields(searchParams: URLSearchParams) {
  const fields: string[] | null = searchParams.getAll("omit[]");
  if (!fields || fields.length <= 0) return {};

  return fields.reduce<Record<string, boolean>>((store, c) => {
    store[c] = true;
    return store;
  }, {});
}
