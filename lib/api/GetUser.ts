import { IUserWithImage } from "@/types";

export const getUserDate = async (userId: string): Promise<IUserWithImage> => {
  const res = await fetch(`http://localhost:3000/api/profile/${userId}`);
  const data = await res.json();
  return data;
};
