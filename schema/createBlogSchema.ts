import { z } from "zod";

export const createBlogSchema = z.object({
  cover: z
    .instanceof(File, { message: "Cover image is required" })
    .refine((file) => file instanceof File, {
      message: "Cover image is required",
    }),
  content: z.any().optional(),
  title: z
    .string({ required_error: "Title required" })
    .min(2, "title is too short"),
  category: z.string({ required_error: "category is required" }).min(1),
});
export type createBlogSchemaTypes = z.infer<typeof createBlogSchema>;
