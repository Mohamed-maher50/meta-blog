"use server";

import { prisma } from "@/prisma";
import { getUserByEmail } from "./userActions";
type verifyTokenResponseType = {
  message: string;
  status: number;
};
export const verifyToken = async (
  token: string
): Promise<verifyTokenResponseType> => {
  const isTokenExists = await prisma.verificationTokens.findFirst({
    where: {
      token: token,
    },
  });
  if (!isTokenExists)
    return {
      message: "Your email is already verified. Please try logging in.",
      status: 200,
    };
  const isExpired = new Date(isTokenExists.expires) < new Date();
  if (isExpired) return { message: "token is Expired", status: 410 };
  const isUserStillExist = await getUserByEmail(isTokenExists.email);
  if (!isUserStillExist)
    return {
      message: "email not exists maybe delete before verification ",
      status: 403,
    };

  const userAfterUpdate = await prisma.user.update({
    where: {
      id: isUserStillExist.id,
    },
    data: {
      emailVerified: new Date(),
      email: isTokenExists.email,
    },
  });
  if (!userAfterUpdate)
    return { message: "verification process not happened sorry", status: 500 };
  await prisma.verificationTokens.delete({
    where: {
      id: isTokenExists.id,
    },
  });
  return {
    message: "successfully verified",
    status: 200,
  };
};
