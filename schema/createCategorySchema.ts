import { z } from "zod";

export const createCategorySchema = z.object({
  label: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "topic is required"
          : "name of topic must be an string",
    })
    .min(1)
    .max(50, { message: "name of topic must be less than 50 characters" }),
});
export type createBlogSchemaTypes = z.infer<typeof createCategorySchema>;
