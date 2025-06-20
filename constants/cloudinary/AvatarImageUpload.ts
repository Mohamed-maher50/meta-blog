import { UploadApiOptions } from "cloudinary";

export const AVATAR_IMAGE_TRANSFORMATION: UploadApiOptions = {
  folder: "profiles",
  overwrite: true,
  format: "webp",
  transformation: {
    width: 96,
    height: 96,
    crop: "fill",
    quality: "auto",
    gravity: "face",
  },
};
