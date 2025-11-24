import { z } from "zod";
export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2, "Name is required"),
  bio: z.string().min(10, "bio is too short").optional(),
  jobTitle: z.string().min(2, "job Title is too short").optional(),
  image: z.string().url().or(z.literal("")),
  Social: z
    .object(
      {
        instagram: z
          .string()
          .url("Invalid URL")
          .regex(
            /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.-]+$/,
            "Invalid Instagram URL"
          )
          .or(z.literal("")),
        facebook: z
          .string()
          .url("Invalid URL")
          .regex(
            /^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9_.-]+$/,
            "Invalid facebook URL"
          )
          .or(z.literal("")),
        twitter: z
          .string()
          .url("Invalid URL")
          .regex(
            /^https?:\/\/(www\.)?(x|twitter)\.com\/[A-Za-z0-9_.-]+$/,
            "Invalid Twitter/X URL"
          )
          .or(z.literal("")),
        linkedin: z
          .string()
          .url("Invalid URL")
          .regex(
            /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+$/,
            "Invalid LinkedIn URL"
          )
          .or(z.literal("")),
      },
      {
        error: (issue) =>
          issue.input === undefined
            ? "required send social link"
            : "social media links not formatted",
      }
    )
    .required(),
});
export type createUserValues = z.infer<typeof createUserSchema>;
export type SocialKey = "instagram" | "facebook" | "twitter" | "linkedin";
