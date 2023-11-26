import { z } from "zod";

export const createMessageSchema = z.object({
  body: z.object({
    senderId: z.string(),
    receiverId: z.array(z.string()),
    groupId: z.string(),
    textMessage: z.string(),
    isRead: z.boolean().default(false),
  }),
});

export const getMessagesSchema = z.object({
  query: z.object({ limit: z.string() }),
  params: z.object({ groupId: z.string() }),
});

export type CreateMessageType = z.infer<typeof createMessageSchema>["body"];
export type GetMessagesType = z.infer<typeof getMessagesSchema>;
