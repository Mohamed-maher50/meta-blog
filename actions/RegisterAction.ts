"use server";

import { AppError, ErrorHandler } from "@/lib/GlobalErrorHandler";
import { hashPassword } from "@/lib/utils";
import { prisma } from "@/prisma";
import { signUpSchema, TSignUpSchema } from "@/schema/authSchema";

import { initialSocial } from "@/app/api/auth/route";
import { generateOtpAction } from "./generateOtpAction";

export const RegistrationAction = async (values: TSignUpSchema) => {
  try {
    const validationResult = signUpSchema.parse(values);
    const isExist = await prisma.user.findFirst({
      where: {
        email: validationResult.email,
      },
    });
    if (isExist) throw new AppError("email already exist please login", 400);
    const hashedPassword = await hashPassword(validationResult.password);
    await prisma.user.create({
      data: {
        email: validationResult.email,
        password: hashedPassword,
        name: validationResult.name,
        Social: initialSocial,
      },
    });

    const status = await generateOtpAction(values.email);
    if (!status.ok)
      return {
        message: "error during send otp ",
        success: false,
        status: 400,
      };
    return {
      message: "verification code sent check your email",
      success: true,
      status: 201,
    };
  } catch (error) {
    const handledError = ErrorHandler(error, false);
    return { ...handledError[0], status: handledError[1].status };
  }
};
