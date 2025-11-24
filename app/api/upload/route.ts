import { NextResponse } from "next/server";
import { AVATAR_IMAGE_TRANSFORMATION, UPLOAD_COVER_IMAGE } from "../constants";
import cloudinary from "@/lib/cloudinary/cloudinary";
import { randomUUID } from "crypto";
import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import { ErrorHandler } from "@/lib/GlobalErrorHandler";
const imageTransformationDetector: Record<string, UploadApiOptions> = {
  cover: UPLOAD_COVER_IMAGE,
  avatar: AVATAR_IMAGE_TRANSFORMATION,
};
export async function POST(req: Request) {
  try {
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imageTransformation =
      imageTransformationDetector[req.headers.get("x-type-image") ?? "cover"];
    const uniqueName = `uploads/${Date.now()}-${randomUUID()}`;
    const uploadResult: UploadApiResponse | undefined = await new Promise(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            public_id: uniqueName,
            ...imageTransformation,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      }
    );
    return NextResponse.json(uploadResult, { status: 200 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
}
