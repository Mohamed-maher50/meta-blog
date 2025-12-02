import { AppError, ErrorHandler } from "@/lib/GlobalErrorHandler";
import { hashPassword } from "@/lib/utils";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";
export const initialSocial = {
  facebook: "",
  instagram: "",
  linkedin: "",
  twitter: "",
};
export const POST = async (req: Request) => {
  try {
    const { email, password, name } = await req.json();
    const isUserExist = await prisma.user.findUnique({
      where: { email },
    });
    if (isUserExist) throw new AppError("user already exist", 400);
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        Social: initialSocial,
      },
    });

    return NextResponse.json(
      {
        user,
      },
      { status: 201 }
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
