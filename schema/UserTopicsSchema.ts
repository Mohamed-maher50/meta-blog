import { z } from "zod";

export const ChooseTopicsSchema = z.object({
  topics: z
    .array(z.string())
    .min(2, { message: "you should choose at least 2 topics" }),
});
export type ChooseTopicsSchemaTypes = z.infer<typeof ChooseTopicsSchema>;
