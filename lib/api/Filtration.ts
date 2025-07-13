const filtrationQuery = <T extends string[]>(
  searchParams: URLSearchParams,
  availableFields: T
): Partial<Record<T[number], string>> => {
  type FilteredKeys = T[number];
  const keys = Array.from(searchParams.keys());
  const filtration: Partial<Record<T[number], string>> = {};
  keys.forEach((k) => {
    if (availableFields.includes(k as FilteredKeys))
      filtration[k as FilteredKeys] = searchParams.get(k) as string;
  });
  return filtration;
};
export default filtrationQuery;
