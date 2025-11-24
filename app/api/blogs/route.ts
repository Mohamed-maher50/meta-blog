import { ApiFutures, requireAuth } from "@/lib/utils";
import { createBlogSchema } from "@/schema/createBlogSchema";
import { prisma } from "@/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import {
  BLOGS_FILTRATION_FIELDS,
  BLOGS_SORT_FIELDS,
  PRISMA_USER_INFO_FIELDS_SELECT,
} from "../constants";
import { Format } from "@prisma/client";
import { ErrorHandler } from "@/lib/GlobalErrorHandler";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const result = createBlogSchema.parse(body);
    const token = await requireAuth(req);

    const { cover, topics, ...blogValues } = result;
    const formattedCover = {
      format: Format.webp,
      width: 800,
      height: 450,
      public_id: cover?.public_id ?? "",
      created_at: new Date().toString(),
      src: cover?.src ?? "",
    };
    const UserBlog = await prisma.$transaction(async (tx) => {
      const createBlog = await tx.blog.create({
        data: {
          cover: formattedCover,
          authorId: token.userId,
          ...blogValues,
        },
      });
      await tx.blogTopics.createMany({
        data: topics.map((t) => ({
          blogId: createBlog.id,
          topicId: t.value,
        })),
      });
      const topicsIds = topics.map((t) => t.value);
      await tx.topics.updateMany({
        where: {
          id: {
            in: topicsIds,
          },
        },
        data: {
          numberOfFollowers: {
            increment: 1,
          },
        },
      });
      return createBlog;
    });
    return Response.json(UserBlog, { status: 201 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};

export const GET = async (req: NextRequest) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const ApiFuture = new ApiFutures(req)
    .search()
    .filter(BLOGS_FILTRATION_FIELDS, ({ searchParams }) => {
      if (!searchParams.get("topicId")) return null;
      return {
        BlogTopics: {
          some: {
            topicId: searchParams.get("topicId") || null,
          },
        },
      };
    })
    .extractFields([])
    .sortBy(BLOGS_SORT_FIELDS)
    .paginateQuery();
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { omit, include, take, skip, ...CountQuery } = ApiFuture.Query;
    const numberOfDocuments = await prisma.blog.count(CountQuery);
    const pagination = ApiFuture.paginate(numberOfDocuments);

    ApiFuture.Query.include = {
      favorites: {
        where: {
          userId: token?.userId,
        },
        select: {
          userId: true,
        },
      },
      BlogLike: {
        where: {
          userId: token?.userId,
        },
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          BlogLike: true,
          Comment: true,
        },
      },
      BlogTopics: {
        include: {
          topic: true,
        },
        omit: {
          blogId: true,
          topicId: true,
        },
      },

      author: {
        select: PRISMA_USER_INFO_FIELDS_SELECT,
      },
    };

    const blogs = await prisma.blog.findMany(ApiFuture.Query);
    return Response.json({
      success: true,
      data: blogs,
      pagination,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
