"use server";

import { AppError, ErrorHandler } from "@/lib/GlobalErrorHandler";
import { verifyHashed } from "@/lib/utils";
import { prisma } from "@/prisma";
import { loginSchema, TLoginSchema } from "@/schema/authSchema";
import { generateOtpAction } from "./generateOtpAction";

import { signIn } from "@/auth";

export const LoginAction = async (values: TLoginSchema) => {
  try {
    const validationResult = loginSchema.parse(values);

    const user = await prisma.user.findUnique({
      where: {
        email: validationResult.email,
      },
    });

    if (!user || !user.password)
      throw new AppError(`cont't find this user`, 403);
    const isVerifyPassword = await verifyHashed(
      validationResult.password,
      user.password
    );
    if (!isVerifyPassword) throw new AppError(`password not correct`, 403);

    if (user.emailVerified) {
      const signInResult = await signIn("credentials", {
        ...values,
        redirect: false,
      });
      if (signInResult.error) throw new AppError(signInResult.error, 403);
      return { message: "successfully login", success: true, status: 200 };
    }

    await generateOtpAction(user.email);

    throw new AppError("verification email required check your email", 302);
  } catch (error) {
    const handledError = ErrorHandler(error, false);
    return { ...handledError[0], status: handledError[1].status };
  }
};
