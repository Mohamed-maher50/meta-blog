import { BlogCardProps, ResponseSuccess } from "@/types";
export const getBlogById = async <T>(
  id: string,
  query?: string,
  init?: RequestInit
): Promise<T> => {
  const queryTrimmed = query ? `?${query}` : "";
  const res = await fetch(
    `http://localhost:3000/api/blogs/${id}/${queryTrimmed}`,
    {
      ...init,
    }
  );
  if (!res.ok) throw new Error(`can't find blog belong to this id: ${id}`);
  return await res.json();
};
export const GetBlogs = async <T>(
  query?: string,
  init?: RequestInit
): Promise<ResponseSuccess<T[]>> => {
  const queryTrimmed = query ? `?${query}` : "";
  const res = await fetch(`http://localhost:3000/api/blogs${queryTrimmed}`, {
    ...init,
  });
  if (!res.ok) throw new Error(`can't fetch blogs`);
  return await res.json();
};
export const GetRecommendedBlogs = async (
  query: string,
  init?: RequestInit
): Promise<ResponseSuccess<BlogCardProps[]>> => {
  const res = await fetch(
    `http://localhost:3000/api/blogs/recommended?${query}`,
    {
      // cache: "force-cache",
      ...init,
    }
  );
  if (!res.ok) throw new Error(`can't fetch blogs`);
  return await res.json();
};
