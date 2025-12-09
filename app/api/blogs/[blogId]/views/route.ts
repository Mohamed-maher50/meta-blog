import { AppError, ErrorHandler } from "@/lib/GlobalErrorHandler";
import { prisma } from "@/prisma";
import { NextRequest } from "next/server";
import { z } from "zod";
const viewSchema = z.object({
  blogId: z.string(),
  visitor_ids: z.array(z.string()),
  userId: z.string().optional(),
});

export const PATCH = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validationResult = viewSchema.parse(body);
    const createdAt = new Date();

    const existingVisit = await prisma.visitors.findFirst({
      where: {
        blogId: validationResult.blogId,
        OR: [
          { visitorId: { in: validationResult.visitor_ids } },
          { userId: validationResult.userId ?? undefined },
        ],
      },
    });

    if (existingVisit) throw new AppError("Already viewed before", 403);

    const newVisitors = validationResult.visitor_ids.map((v) => ({
      blogId: validationResult.blogId,
      userId: validationResult.userId,
      visitorId: v,
      createdAt,
    }));

    const result = await prisma.$transaction(async (tx) => {
      await tx.visitors.createMany({ data: newVisitors });
      const blogAfterUpdate = await tx.blog.update({
        where: { id: validationResult.blogId },
        data: { views_count: { increment: 1 } },
      });
      return blogAfterUpdate;
    });

    return Response.json(result);
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
