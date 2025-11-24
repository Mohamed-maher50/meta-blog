import { IUserWithImage } from "@/types";
import { baseUrl } from "../baseUrl";

export const getUser = async (): Promise<IUserWithImage> => {
  const res = await fetch(`${baseUrl}/api/profile`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data;
};
