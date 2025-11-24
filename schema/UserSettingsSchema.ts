import { z } from "zod";
export const SettingValuesSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2, "Name is required"),
  bio: z.string().nullish(),
  url: z.string().url().optional(),
  jobTitle: z.string().nullish(),
  image:
    typeof File !== "undefined"
      ? z.instanceof(File).optional()
      : z.any().optional(),
  social: z
    .object({
      instagram: z
        .string()
        .url("Invalid URL")
        .regex(
          /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.-]+$/,
          "Invalid Instagram URL"
        )
        .optional()
        .or(z.literal("")),
      facebook: z
        .string()
        .url("Invalid URL")
        .regex(
          /^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9_.-]+$/,
          "Invalid Instagram URL"
        )
        .optional()
        .or(z.literal("")),
      twitter: z
        .string()
        .url("Invalid URL")
        .regex(
          /^https?:\/\/(www\.)?(x|twitter)\.com\/[A-Za-z0-9_.-]+$/,
          "Invalid Twitter/X URL"
        )
        .optional()
        .or(z.literal("")),
      linkedin: z
        .string()
        .url("Invalid URL")
        .regex(
          /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+$/,
          "Invalid LinkedIn URL"
        )
        .optional()
        .or(z.literal("")),
    })
    .optional(),
});
export type SettingsFormValuesType = z.infer<typeof SettingValuesSchema>;
export type SocialKey = "instagram" | "facebook" | "twitter" | "linkedin";
