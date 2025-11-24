import { z } from "zod";

export const createCategorySchema = z.object({
  label: z
    .string({
      required_error: "topic is required",
      message: "name of topic must be an string",
    })
    .min(1)
    .max(50, { message: "name of topic must be less than 50 characters" }),
});
export type createBlogSchemaTypes = z.infer<typeof createCategorySchema>;
