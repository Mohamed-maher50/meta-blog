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
});
export type SettingsFormValuesType = z.infer<typeof SettingValuesSchema>;
