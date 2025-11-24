import { z } from "zod";

export const userLikedBlogSchema = z.object({
  blogId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId"),
});
