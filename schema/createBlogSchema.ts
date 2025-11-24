import { z } from "zod";

export const createBlogSchema = z.object({
  cover: z
    .object(
      {
        public_id: z.string().min(3),
        src: z.string().min(5),
      },
      { error: "please provide cover image" }
    )
    .optional(),
  content: z.any(),
  title: z.string({ error: "Title required" }).min(2, "title is too short"),
  topics: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .min(1),
  readingTime: z.number().min(1, "Reading time must be at least 1 minute"),
});
export type createBlogSchemaTypes = z.infer<typeof createBlogSchema>;
