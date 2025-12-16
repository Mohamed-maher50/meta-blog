import { prisma } from "@/prisma";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { Favorites } from "@prisma/client";
import { ApiFuturesQuery, requireAuth } from "@/lib/utils";
import { PRISMA_USER_INFO_FIELDS_SELECT } from "../../constants";
import { ErrorHandler } from "@/lib/GlobalErrorHandler";
const newFavoriteSchema = z.object({
  blogId: z.string().refine(
    (val) => {
      try {
        return new ObjectId(val); // Attempt to create ObjectId
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        return false; // Not a valid ObjectId string
      }
    },
    {
      message: "Must be a valid MongoDB ObjectId string",
    }
  ),
});

export interface ApiGetFavoritesSuccess {
  data: Favorites;
  message: string;
  status: number;
}
export const POST = async (req: Request) => {
  try {
    const { user } = await requireAuth();
    const data = await req.json();
    const validationResult = newFavoriteSchema.parse(data);

    const findIfInFavoritesCondition = {
      AND: [
        {
          blogId: validationResult.blogId.toString(),
        },
        {
          userId: user.userId,
        },
      ],
    };

    const findIfInFavorites = await prisma.favorites.findFirst({
      where: findIfInFavoritesCondition,
    });

    if (!findIfInFavorites) {
      const newFavorite = await prisma.favorites.create({
        data: {
          userId: user.userId,
          blogId: validationResult.blogId.toString(),
        },
      });
      return Response.json(
        { data: newFavorite, message: "add Successfully" },
        { status: 201 }
      );
    }

    await prisma.favorites.delete({ where: { id: findIfInFavorites.id } });
    return Response.json(
      { data: null, message: "successfully deleted" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
export const GET = async (req: NextRequest) => {
  try {
    const { user } = await requireAuth();
    const apiFutures = new ApiFuturesQuery(req)
      .search()
      .filter(["blogId"])
      .paginateQuery()
      .omit([])
      .sort(["createdAt"]);
    apiFutures.Query.where = {
      blog: apiFutures.Query.where,
      userId: user.userId,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { omit, include, take, skip, ...CountQuery } = apiFutures.Query;

    const numberOfDocuments = await prisma.favorites.count(CountQuery);
    const pagination = apiFutures.paginate(numberOfDocuments);
    const blogOmits = { ...apiFutures.Query.omit };
    apiFutures.Query.omit = {};
    apiFutures.Query.include = {
      blog: {
        omit: blogOmits,

        include: {
          favorites: {
            where: {
              userId: user.userId,
            },
            select: {
              userId: true,
            },
          },
          BlogLike: {
            where: {
              userId: user.userId,
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
          author: {
            select: PRISMA_USER_INFO_FIELDS_SELECT,
          },
          BlogTopics: {
            include: {
              topic: true,
            },
          },
        },
      },
    };
    const favorites = await prisma.favorites.findMany(apiFutures.Query);
    return Response.json({
      success: true,
      data: favorites,
      pagination,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
