"use server";

import { resend } from "@/lib/SendEmail";
import { prisma } from "@/prisma";
import { getOtpCode } from "@/utils/GenerateOtp";

export const generateOtpAction = async (email: string) => {
  try {
    const code = getOtpCode();
    const expires = new Date(Date.now() + 1000 * 60 * 2);
    await prisma.otpCode.upsert({
      where: { email },
      create: { email, code, expiresAt: expires },
      update: { code, expiresAt: expires, createdAt: new Date() },
    });

    const to =
      process.env.NODE_ENV === "development"
        ? "mohamedmaher.mm330@gmail.com"
        : email;
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [to],
      subject: "Verify Your Email - OTP Code",
      html: `<span>code: ${code}</span>`,
    });
    return { ok: true };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { ok: false };
  }
};
export const resendOtpAction = generateOtpAction;
