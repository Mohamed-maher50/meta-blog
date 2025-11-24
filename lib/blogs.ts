import { BlogCardProps, ResponseSuccess } from "@/types";
import { baseUrl } from "./baseUrl";
export const getBlogById = async <T>(
  id: string,
  query?: string,
  init?: RequestInit
): Promise<T> => {
  const queryTrimmed = query ? `?${query}` : "";
  const res = await fetch(`${baseUrl}/api/blogs/${id}/${queryTrimmed}`, {
    ...init,
  });
  if (!res.ok) throw new Error(`can't find blog belong to this id: ${id}`);
  return await res.json();
};
export const GetBlogs = async <T>(
  query?: string,
  init?: RequestInit
): Promise<ResponseSuccess<T[]>> => {
  const queryTrimmed = query ? `?${query}` : "";
  const res = await fetch(`${baseUrl}/api/blogs${queryTrimmed}`, {
    ...init,
  });
  if (!res.ok) throw new Error(`can't fetch blogs`);
  return await res.json();
};
export const GetRecommendedBlogs = async (
  query: string,
  init?: RequestInit
): Promise<ResponseSuccess<BlogCardProps[]>> => {
  const res = await fetch(`${baseUrl}/api/blogs/recommended?${query}`, {
    // cache: "force-cache",
    ...init,
  });
  if (!res.ok) throw new Error(`can't fetch blogs`);
  return await res.json();
};
