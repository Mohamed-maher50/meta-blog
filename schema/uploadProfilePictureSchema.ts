import { SettingValuesSchema } from "./UserSettingsSchema";
export const uploadProfilePictureSchema = SettingValuesSchema.pick({
  image: true,
});
