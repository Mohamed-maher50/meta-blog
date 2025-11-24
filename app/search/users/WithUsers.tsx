"use client";
import WithInfinityScroll from "@/components/Hocs/WithInfinityScroll";
import InfinityUsersSection from "./InfinityUsersSection";
import { ResponseSuccess, UserInfo } from "@/types";
const getUsers = async (
  query: string,
  init?: RequestInit
): Promise<ResponseSuccess<(UserInfo & { isFollowing: boolean })[]>> => {
  const res = await fetch(`http://localhost:3000/api/users?${query}`, {
    ...init,
  });
  if (!res.ok) throw new Error(`can't fetch users`);
  return await res.json();
};

export default WithInfinityScroll(
  InfinityUsersSection,
  async ({ page, query }) => {
    return await getUsers(`page=${page}&limit=10&q=${query}`);
  }
);
