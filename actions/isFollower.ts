"use server";

import { prisma } from "@/prisma";

export async function isFollowerAction(userId: string, followerId: string) {
  const result = await prisma.follow.findFirst({
    where: {
      followerId: followerId,
      followeeId: userId,
    },
  });
  if (result) return true;
  return false;
}
