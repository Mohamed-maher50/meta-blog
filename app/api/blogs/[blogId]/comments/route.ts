import { PRISMA_USER_INFO_FIELDS_SELECT } from "@/app/api/constants";
import { ErrorHandler } from "@/lib/GlobalErrorHandler";
import { ApiFutures, requireAuth } from "@/lib/utils";
import { prisma } from "@/prisma";
import { createCommentSchema } from "@/schema/Comments";
import { NextRequest } from "next/server";
export const POST = async (
  req: Request,
  { params }: { params: Promise<{ blogId: string }> }
) => {
  try {
    const { user } = await requireAuth();
    const body = await req.json();
    const { blogId } = await params;

    const result = createCommentSchema.parse(body);

    const newComment = await prisma.comment.create({
      data: {
        content: result.content,
        blogId: blogId,
        authorId: user.userId,
      },
    });

    return Response.json(newComment, { status: 201 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};

const commentsSortFields = ["CommentLike", "createdAt", "authorId"];
const COMMENTS_FILTRATION_FIELDS = ["authorId", "blogId"];
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) => {
  try {
    const { blogId } = await params;

    const apiFutures = new ApiFutures(req)
      .search({
        label: "content",
      })
      .extractFields()
      .filter(COMMENTS_FILTRATION_FIELDS, () => {
        return {
          blogId,
        };
      })
      .sortBy(commentsSortFields)
      .paginateQuery();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { include, omit, skip, take, ...countQuery } = apiFutures.Query;
    apiFutures.Query.include = {
      ...apiFutures.Query.include,
      CommentLike: {
        select: {
          userId: true,
        },
      },
      author: {
        select: PRISMA_USER_INFO_FIELDS_SELECT,
      },
    };
    const numberOfDocuments = await prisma.comment.count(countQuery);
    const pagination = apiFutures.paginate(numberOfDocuments);
    const comments = await prisma.comment.findMany(apiFutures.Query);
    return Response.json({
      success: true,
      data: comments,
      pagination,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
