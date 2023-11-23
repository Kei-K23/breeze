import { z } from "zod";

export const getSessionSchema = z.object({
  params: z.object({
    token_id: z.string(),
  }),
});

export type GetSessionType = z.infer<typeof getSessionSchema>["params"];
