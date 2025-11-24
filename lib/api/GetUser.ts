import { IUserWithImage } from "@/types";

export const getUser = async (): Promise<IUserWithImage> => {
  const res = await fetch(`http://localhost:3000/api/profile`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data;
};
