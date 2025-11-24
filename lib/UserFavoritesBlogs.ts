import { ResponseSuccess } from "@/types";

export const GET_USER_FAVORITES = async <T>(
  query?: string,
  options?: RequestInit
): Promise<ResponseSuccess<T>> => {
  const queryTrimmed = query ? `?${query}` : "";
  const res = await fetch(
    `http://localhost:3000/api/favorites${queryTrimmed}`,
    options
  );
  const data = await res.json();
  return data;
};
