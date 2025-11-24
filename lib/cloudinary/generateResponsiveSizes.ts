import { ConfigAndUrlOptions, TransformationOptions } from "cloudinary";
import cloudinary from "./cloudinary";
import { RESPONSIVE_BLOG_IMAGES_SIZES } from "@/app/api/constants";

export const generateResponsiveSize = (
  public_id: string,
  options: TransformationOptions | ConfigAndUrlOptions
) => {
  return cloudinary.url(public_id, options);
};
export const generateResponsiveSizes = (public_id: string) => {
  const sizesUrls = RESPONSIVE_BLOG_IMAGES_SIZES.map((size) => {
    const url = generateResponsiveSize(public_id, {
      format: "webp",
      width: size.width,
      height: size.height,
      crop: "fill",
      quality: "auto",
    });
    return {
      src: url,
      width: size.width,
      height: size.height,
      name: size.name,
    };
  });
  return sizesUrls;
};
