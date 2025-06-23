import { z } from "zod";

export const blogPostSchemaApi = z.object({
  cover: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPEG, PNG, and WebP images are allowed"
    ),

  content: z.any(),
  title: z
    .string({ required_error: "Title required" })
    .min(2, "title is too short"),
  category: z.string({ required_error: "category is required" }).min(1),
  userId: z
    .string({
      required_error: "userId is required",
      invalid_type_error: "userId must be a string",
    })
    .regex(/^[0-9a-f]{24}$/, { message: "Not a valid MongoDB ObjectId" }),
});
