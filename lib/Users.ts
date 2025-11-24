import { ResponseSuccess } from "@/types";

export const GetUsers = async <T>(
  query: string,
  options?: RequestInit
): Promise<ResponseSuccess<T>> => {
  const queryTrimmed = query ? `?${query}` : "";
  const res = await fetch(
    `http://localhost:3000/api/users${queryTrimmed}`,
    options
  );
  const data = await res.json();
  return data;
};
export const GetUserById = async <T>(
  id: string,
  query: string,
  options?: RequestInit
): Promise<T> => {
  const queryTrimmed = query ? `?${query}` : "";
  const res = await fetch(
    `http://localhost:3000/api/users/${id}/${queryTrimmed}`,
    options
  );
  const data = await res.json();
  return data;
};
