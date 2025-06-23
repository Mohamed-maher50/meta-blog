export default function ExtractQuery(searchParams: URLSearchParams) {
  const search = searchParams.get("q");

  return (fields: string[] | string) => {
    if (!search) return {};

    if (typeof fields == "string") {
      return {
        [fields]: {
          contains: search,
          mode: "insensitive",
        },
      };
    } else {
      return {
        OR: fields.map((f) => {
          return {
            [f]: {
              contains: search,
              mode: "insensitive",
            },
          };
        }),
      };
    }
  };
}
