import { extractFields } from "@/lib/api/extractFields";
import { prisma } from "@/prisma";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) => {
  try {
    const { blogId } = await params;
    const searchParams = req.nextUrl.searchParams;
    const extractedFields = extractFields(searchParams);
    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
      include: {
        author: {
          omit: {
            bio: true,
            password: true,
          },
        },
      },
      omit: extractedFields,
    });
    if (!blog)
      return Response.json(
        {
          message: `Blog not found. Please check the blog ${blogId} and try again.`,
        },
        { status: 404 }
      );
    return Response.json(blog, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
};
