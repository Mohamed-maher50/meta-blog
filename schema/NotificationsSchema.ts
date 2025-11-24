import { NotificationType } from "@prisma/client";
import { z } from "zod";

export const newNotificationSchema = z.object({
  userId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId"),
  type: z.enum(Object.values(NotificationType) as [NotificationType]),
  message: z.string().optional(),
  entityId: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId")
    .optional(),
});
