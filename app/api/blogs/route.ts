import { imageTypesOrder } from "@/constants/api/imageTypesOrder";
import { UPLOAD_COVER_IMAGE } from "@/constants/cloudinary/UploadCoverImage";
import { extractFields } from "@/lib/api/extractFields";
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

    const cover = convertToCoverFormat.call(null, uploadCoverResult);
    const blog = await prisma.blog.create({
      data: {
        content: rowData.content as InputJsonObject,
        authorId: rowData.userId,
        category: rowData.category,
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

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const extractedFields = extractFields(searchParams);
  const paginationResult = pagination(searchParams);
  const blogs = await prisma.blog.findMany({
    include: {
      author: {
        omit: {
          bio: true,
          password: true,
        },
      },
    },
    omit: extractedFields,
    ...paginationResult,
  });
  return Response.json(blogs);
};
