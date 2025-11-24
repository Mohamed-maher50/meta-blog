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
export const ACTION_NOTIFICATIONS_MESSAGES = {
  LIKE: "liked your Blog",
  COMMENT: "commented on your Blog",
  FOLLOW: "started following you",
  BLOG: "published a new blog",
  CommentLike: "liked your comment",
};
export const BLOGS_FILTRATION_FIELDS = ["authorId"];
export const BLOGS_SORT_FIELDS = [
  "title",
  "popularity",
  "createdAt",
  "views_count",
];
export type T_RESPONSIVE_BLOG_IMAGES_SIZES = ResponsiveImageSize[];
export type ResponsiveImageSize = {
  width: number;
  height: number;
  name: string;
  src?: string; // Optional, can be set later
};
export const RESPONSIVE_BLOG_IMAGES_SIZES = [
  {
    width: 750,
    height: 420,
    name: "mobile",
  },
  {
    width: 800,
    height: 450,
    name: "card",
  },
  {
    width: 1200,
    height: 675,
    name: "tablet",
  },
  {
    width: 1920,
    height: 1080,
    name: "desktop",
  },
];
export const UPLOAD_COVER_IMAGE = {
  transformation: {
    folder: "blog_images",
    transformation: [
      {
        width: 1920,
        height: 1080,
        crop: "fill",
        gravity: "auto:faces",
        quality: "auto:good",
        fetch_format: "auto",
      },
    ],
  },
  eager: [
    {
      width: 1920,
      height: 1080,
      crop: "fill",
      gravity: "auto:faces",
    }, // Cover
    {
      width: 800,
      height: 450,
      crop: "fill",
      gravity: "auto:faces",
    }, // Card
  ],
  eager_async: true,
};

export const USER_INFO_FIELDS = [
  "name",
  "email",
  "image",
  "id",
  "bio",
  "Social",
  "jobTitle",
];
type USER_INFO_FIELDS_KEY_TYPE = (typeof USER_INFO_FIELDS)[number];
export const PRISMA_USER_INFO_FIELDS_SELECT = USER_INFO_FIELDS.reduce<
  Record<USER_INFO_FIELDS_KEY_TYPE, true>
>((obj, key) => {
  obj[key] = true;
  return obj;
}, {});
