import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/prisma";
import { UploadApiResponse } from "cloudinary";

export const POST = async (req: Request) => {
  const data = await req.formData();

  const image = data.get("image") as File | null;
  const name = data.get("name") as string;
  const bio = data.get("bio") as string;
  const jobTitle = data.get("jobTitle") as string;
  try {
    let result: UploadApiResponse | undefined = undefined;
    if (image) {
      result = await new Promise(async (resolve, reject) => {
        const buffer = Buffer.from(await image.arrayBuffer());
        cloudinary.uploader
          .upload_stream(
            {
              folder: "profiles",
              public_id: name || undefined,
              overwrite: true,
              format: "webp",
              transformation: {
                width: 96,
                height: 96,
                crop: "fill",
                quality: "auto",
                gravity: "face",
              },
            },
            (error, result) => {
              if (error) return reject(error);
              return resolve(result);
            }
          )
          .end(buffer);
      });
    }
    const updatedUser = await prisma.user.update({
      where: {
        id: data.get("userId") as string,
      },
      data: {
        name: name || undefined,
        bio: bio || undefined,
        image: {
          width: 96,
          height: 96,
          url: result?.secure_url || undefined,
        },
        jobTitle: jobTitle || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        image: true,
        jobTitle: true,
      },
    });
    return Response.json(updatedUser, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
};
