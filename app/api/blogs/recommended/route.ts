import { prisma } from "@/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { BLOGS_FILTRATION_FIELDS, BLOGS_SORT_FIELDS } from "../../constants";
import { ApiFutures } from "@/lib/utils";
import { ErrorHandler } from "@/lib/GlobalErrorHandler";

export const GET = async (req: NextRequest) => {
  const ApiFuture = new ApiFutures(req)
    .search()
    .filter(BLOGS_FILTRATION_FIELDS, ({ searchParams }) => {
      if (!searchParams.get("topicId")) return null;
      return {
        ...(userTopicIds.length > 0
          ? {
              BlogTopics: {
                some: {
                  topicId: { in: userTopicIds },
                },
              },
            }
          : {}),
      };
    })
    .extractFields([])
    .sortBy(BLOGS_SORT_FIELDS, (searchParams) => {
      const blogLikeKey = searchParams.getAll("orderBy[]");
      return {
        BlogLike: {
          _count: blogLikeKey.includes("-BlogLike") ? "desc" : "asc",
        },
      };
    })
    .paginateQuery();

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const userTopics = await prisma.userTopic.findMany({
    where: {
      userId: token?.userId,
    },
  });
  const userTopicIds = userTopics.map((topic) => topic.topicId);
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
        omit: {
          bio: true,
          password: true,
          createdAt: true,
          isFirstVisit: true,
          likedUsers: true,
          updatedAt: true,
        },
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
