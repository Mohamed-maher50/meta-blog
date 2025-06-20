import { z } from "zod";
import { SettingValuesSchema } from "./UserSettingsSchema";

export const updateSettingsValuesSchema = SettingValuesSchema.omit({
  url: true,
})
  .partial() // make all other fields optional
  .extend({
    userId: z
      .string({
        required_error: "userId is required",
        invalid_type_error: "userId must be a string",
      })
      .regex(/^[0-9a-f]{24}$/, { message: "Not a valid MongoDB ObjectId" }),
  });
export type UpdateSettingsValuesType = z.infer<
  typeof updateSettingsValuesSchema
>;
