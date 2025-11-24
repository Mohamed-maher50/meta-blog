import { z } from "zod";
import { SettingValuesSchema } from "./UserSettingsSchema";

export const updateSettingsValuesSchema = SettingValuesSchema.omit({
  image: true,
})
  .extend({
    image: z.string().url("Invalid image URL"),
  })
  .partial();

export type UpdateSettingsValuesType = z.infer<
  typeof updateSettingsValuesSchema
>;
