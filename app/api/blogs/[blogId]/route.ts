import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary/cloudinary";
import { AppError, ErrorHandler } from "@/lib/GlobalErrorHandler";
import { ApiFuturesQuery, requireAuth } from "@/lib/utils";
import { prisma } from "@/prisma";
import { EditBlogSchema } from "@/schema/EditBlogSchema";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) => {
  try {
    const session = await auth();

    const { blogId } = await params;
    const ApiFutures = new ApiFuturesQuery(req).omit([]);

    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
      include: {
        _count: {
          select: {
            BlogLike: true,
            Comment: true,
          },
        },
        BlogLike: {
          where: {
            userId: session?.user?.userId,
          },
          select: {
            userId: true,
          },
        },
        BlogTopics: {
          include: {
            topic: true,
          },
        },
        author: {
          omit: {
            bio: true,
            password: true,
          },
        },
      },
      omit: ApiFutures.Query.omit,
    });

    if (!blog)
      throw new AppError(
        `No blog found with id "${blogId}". It seems this post took a detour into the void — check the id or craft a new story.`,
        404
      );
    const BlogTopics = [...blog.BlogTopics.map((b) => b.topic)];
    return Response.json({ ...blog, BlogTopics }, { status: 200 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) => {
  try {
    const { user } = await requireAuth();

    const { blogId } = await params;

    const result = await prisma.$transaction(async (tx) => {
      const isBlogExist = await tx.blog.findUnique({
        where: { id: blogId, authorId: user.userId },
      });
      if (!isBlogExist)
        throw new AppError(
          "not found any blog belong to this id :" + blogId,
          400
        );
      const query = { where: { blogId: blogId } };
      await tx.blogLike.deleteMany(query);
      await tx.comment.deleteMany(query);
      await tx.blogTopics.deleteMany(query);
      await tx.favorites.deleteMany(query);
      const blogAfterDelete = await tx.blog.delete({
        where: {
          id: blogId,
          authorId: user.userId,
        },
      });
      return blogAfterDelete;
    });

    return Response.json(result, { status: 200 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) => {
  try {
    const { user } = await requireAuth();

    const body = await req.json();

    const validationResult = EditBlogSchema.parse(body);

    const { blogId } = await params;

    const blogIsExists = await prisma.blog.findFirst({
      where: {
        id: blogId,
      },
    });
    if (!blogIsExists)
      throw new AppError("blog not found or you don't have access", 204);
    const findBlogTopics = await prisma.blogTopics.findMany({
      where: {
        blogId,
      },
    });
    if (validationResult.topics) {
      const topicsIds = validationResult?.topics.map((t) => t.value);
      const topicsNotExist: string[] = [];

      findBlogTopics.forEach((topic) => {
        if (!topicsIds.includes(topic.topicId))
          return topicsNotExist.push(topic.topicId);
        topicsIds.splice(
          topicsIds.findIndex((e) => e == topic.topicId),
          1
        );
      });

      await prisma.blogTopics.deleteMany({
        where: {
          blogId,
          topicId: {
            in: topicsNotExist,
          },
        },
      });
      await prisma.blogTopics.createMany({
        data: topicsIds.map((e) => ({ blogId, topicId: e })),
      });
    }
    delete validationResult.topics;
    if (validationResult.cover?.public_id) {
      cloudinary.uploader.destroy(blogIsExists.cover.public_id);
    }

    await prisma.blog.update({
      where: {
        authorId: user.userId,
        id: blogId,
      },
      data: {
        ...validationResult,
        cover: {
          ...blogIsExists.cover,
          src: validationResult.cover?.src || blogIsExists.cover.src,
          public_id:
            validationResult.cover?.public_id || blogIsExists.cover.public_id,
        },
      },
    });
    return Response.json({}, { status: 200 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
