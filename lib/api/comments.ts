import { ResponseComment, ResponseSuccess } from "@/types";

export const GetComments = async <T extends ResponseComment>({
  id,
  query,
  init,
}: {
  id: string;
  query?: string;
  init?: RequestInit;
}): Promise<ResponseSuccess<T[]>> => {
  const res = await fetch(`/api/blogs/${id}/comments${query}`, {
    ...init,
  });
  if (!res.ok) throw new Error(`can't fetch blogs`);
  return await res.json();
};
