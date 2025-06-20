import { AVATAR_IMAGE_TRANSFORMATION } from "@/constants/cloudinary/AvatarImageUpload";
import { UploadFile } from "@/lib/cloudinary/uploadFile";
import { prisma } from "@/prisma";
import { updateSettingsValuesSchema } from "@/schema/UpdateSettingsSchema";
type availableUpdateFields = {
  image: {
    width: number;
    height: number;
    url: string;
  };
  bio: string;
  name: string;
  jobTitle: string;
};
export const POST = async (req: Request) => {
  const updatedValues: Record<string, FormDataEntryValue> = {};
  const data = await req.formData();

  let image: File | null = null;
  data.forEach((value, key) => {
    if (typeof value == "string") updatedValues[key] = value;
    else if (value instanceof File) image = value;
  });
  const validationResult = updateSettingsValuesSchema.safeParse(updatedValues);
  if (!validationResult.success) {
    return Response.json(validationResult.error.format(), { status: 400 });
  }
  try {
    let updateUserValues: Partial<availableUpdateFields> = {};
    if (image) {
      AVATAR_IMAGE_TRANSFORMATION.public_id = `user_picture_${updatedValues.userId}`;
      const uploadImageResult = await UploadFile(
        image,
        AVATAR_IMAGE_TRANSFORMATION
      );
      updateUserValues.image = {
        height: 96,
        width: 96,
        url: uploadImageResult.secure_url,
      };
    }
    delete updatedValues.userId;
    updateUserValues = { ...updateUserValues, ...updatedValues };

    const updatedUser = await prisma.user.update({
      where: {
        id: data.get("userId") as string,
      },
      data: updateUserValues,
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
