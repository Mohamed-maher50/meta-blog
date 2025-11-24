import { v4 as uuidv4 } from "uuid";
import { resend } from "./SendEmail";
import { prisma } from "@/prisma";
import { baseUrl } from "./baseUrl";
const findTokenByEmail = async (email: string) => {
  return await prisma.verificationTokens.findUnique({
    where: {
      email,
    },
  });
};
export const generateToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const isTokenExist = await findTokenByEmail(email);

  if (isTokenExist)
    await prisma.verificationTokens.delete({ where: { email } });

  return await prisma.verificationTokens.create({
    data: {
      email,
      expires,
      token,
    },
  });
};
export const sendVerificationEmail = async ({
  token,
}: {
  email: string;
  token: string;
}) => {
  const confirmLink = `${baseUrl}/auth/new-verification?token=${token}`;
  return resend.emails.send({
    from: "onboarding@resend.dev",
    to: "mohamedmaher.mm330@gmail.com",
    subject: "verification link",
    html: `<p> click on this link to verify you email <a href="${confirmLink}">click here</a></p>`,
  });
};
