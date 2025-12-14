import { NextRequest } from "next/server";
import { BLOGS_FILTRATION_FIELDS, BLOGS_SORT_FIELDS } from "../../constants";
import { ApiFuturesQuery } from "@/lib/utils";
import { ErrorHandler } from "@/lib/GlobalErrorHandler";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
const blogLikeCondition = (searchParams: URLSearchParams) => {
  const blogLikeKey = searchParams.get("sort")?.split(",");
  const filtration = [];
  if (blogLikeKey?.includes("-BlogLike")) {
    filtration.unshift({
      BlogLike: {
        _count: "desc",
      },
    });
  }
  if (blogLikeKey?.includes("-views_count"))
    filtration.unshift({
      views_count: "desc",
    });
  return filtration;
};
export const GET = async (req: NextRequest) => {
  const ApiFuture = new ApiFuturesQuery(req)
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
    .omit()
    .sortAppend(blogLikeCondition)
    .sort(BLOGS_SORT_FIELDS)
    .paginateQuery();

  const session = await auth();

  const userTopics = await prisma.userTopic.findMany({
    where: {
      userId: session?.user?.userId,
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
          userId: session?.user?.userId,
        },
        select: {
          userId: true,
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
