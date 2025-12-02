"use server";

import { prisma } from "@/prisma";

export const verificationOtpAction = async ({
  email,
  code,
}: {
  email: string;
  code: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!existingUser) return { error: "User not found", status: false };
  const isOtpExists = await prisma.otpCode.findUnique({
    where: {
      email,
      code,
    },
  });
  if (!isOtpExists) return { error: "not valid otp", status: false };
  if (isOtpExists.expiresAt < new Date())
    return { error: "not valid otp", status: false };
  await prisma.otpCode.delete({ where: { email } });

  if (!isOtpExists) return { error: "not valid otp", status: false };
  await prisma.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: email,
    },
  });

  return { success: "Email verified", status: true };
};
