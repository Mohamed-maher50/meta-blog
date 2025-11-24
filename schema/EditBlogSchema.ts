import { z } from "zod";
import { createBlogSchema } from "./createBlogSchema";

export const EditBlogSchema = createBlogSchema
  .extend({
    cover: z.object({
      public_id: z.string().min(3).optional(),
      src: z.string().min(5).optional(),
    }),
  })
  .partial();
export type EditBlogSchemaTypes = z.infer<typeof EditBlogSchema>;
