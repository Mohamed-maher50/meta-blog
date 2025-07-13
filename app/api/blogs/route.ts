import { imageTypesOrder } from "@/constants/api/imageTypesOrder";
import { UPLOAD_COVER_IMAGE } from "@/constants/cloudinary/UploadCoverImage";
import { extractFields } from "@/lib/api/extractFields";
import filtrationQuery from "@/lib/api/Filtration";
import pagination from "@/lib/api/pagination";
import { UploadFile } from "@/lib/cloudinary/uploadFile";
import { convertToCoverFormat } from "@/lib/utils";
import { prisma } from "@/prisma";
import { blogPostSchemaApi } from "@/schema/blogPostSchemaApi";
import { EagerImage } from "@prisma/client";
import { InputJsonObject } from "@prisma/client/runtime/library";
import { UploadApiResponse } from "cloudinary";
import { NextRequest } from "next/server";
type rowDataType = {
  content: { type: string; content: unknown[] };
  title: string;
  category: string;
  userId: string;
  cover: File;
};

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const content = formData.get("body");

    const rowData: rowDataType = {
      cover: formData.get("cover") as File,
      ...(typeof content === "string" && JSON.parse(content)),
    };

    const result = await blogPostSchemaApi.safeParseAsync(rowData);
    if (!result.success) Response.json(result.error.format(), { status: 400 });

    const uploadCoverResult: UploadApiResponse = await UploadFile(
      rowData.cover,
      UPLOAD_COVER_IMAGE
    );

    const responsiveImage = uploadCoverResult.eager.map(
      (img: EagerImage, idx: number) => {
        return {
          ...img,
          type: imageTypesOrder[idx],
        };
      }
    );
    const category = await prisma.categories.upsert({
      where: {
        name: rowData.category,
      },
      create: {
        name: rowData.category,
      },
      update: {
        topPosition: {
          increment: 1,
        },
      },
    });

    const cover = convertToCoverFormat.call(null, uploadCoverResult);
    const blog = await prisma.blog.create({
      data: {
        content: rowData.content as InputJsonObject,
        authorId: rowData.userId,
        categoryId: category.id,
        title: rowData.title,
        images: responsiveImage,
        cover,
      },
    });
    console.log(blog);
    return Response.json(uploadCoverResult);
  } catch (error) {
    return Response.json(error);
  }
};

const availableFields = ["authorId", "categoryId"];
export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const extractedFields = extractFields(searchParams);
  const paginationResult = pagination(searchParams);

  const filtration = filtrationQuery<typeof availableFields>(
    searchParams,
    availableFields
  );
  const customFiltration = { ...filtration, title: {} };
  if (searchParams.get("q")) {
    customFiltration["title"] = {
      title: {
        contains: searchParams.get("q"),
        mode: "insensitive",
      },
    };
  }
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        ...filtration,
      },
      include: {
        category: true,
        author: {
          omit: {
            bio: true,
            password: true,
            createdAt: true,
          },
        },
      },
      omit: extractedFields,
      ...paginationResult,
    });
    return Response.json(blogs);
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
};
