import { EmptyStateAlert } from "@/components/EmptyStateAlert";
import UserCard from "@/components/users/UserCard";
import { ResponseSuccess, UserInfo } from "@/types";
import { headers } from "next/headers";
import React from "react";
import WithUsers from "./WithUsers";

const LIMIT_ITEMS = 10;
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

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { q } = await searchParams;
  const { data, pagination } = await getUsers(
    `q=${q}&limit=${LIMIT_ITEMS}&page=1`,
    {
      headers: await headers(),
    }
  );
  if (!pagination.totalItems)
    return <EmptyStateAlert type="users" searchQuery={q} />;
  return (
    <div className="  grid gap-2">
      {data.map((user) => {
        return <UserCard user={user} key={user.id} />;
      })}
      <WithUsers query={q} />
    </div>
  );
};

export default page;
