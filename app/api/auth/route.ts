import { hashPassword } from "@/lib/utils";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { email, password, name } = await req.json();
    const isUserExist = await prisma.user.findUnique({
      where: { email },
    });
    if (isUserExist)
      return NextResponse.json(
        { error: "email already exists" },
        { status: 400 }
      );
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
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
    return NextResponse.json(
      { error: "server can handle request" },
      { status: 500 }
    );
  }
};
