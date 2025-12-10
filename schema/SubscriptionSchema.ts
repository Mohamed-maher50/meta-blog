import { z } from "zod";

export const newSubscriptionSchema = z.object({
  email: z

    .email({
      error: "not valid email",
    })
    .trim(),
});
export type subscriptionValues = z.infer<typeof newSubscriptionSchema>;
