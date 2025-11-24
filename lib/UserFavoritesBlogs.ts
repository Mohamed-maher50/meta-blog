import { ResponseSuccess } from "@/types";
import { baseUrl } from "./baseUrl";

export const GET_USER_FAVORITES = async <T>(
  query?: string,
  options?: RequestInit
): Promise<ResponseSuccess<T>> => {
  const queryTrimmed = query ? `?${query}` : "";
  const res = await fetch(`${baseUrl}/api/favorites${queryTrimmed}`, options);
  const data = await res.json();
  return data;
};
