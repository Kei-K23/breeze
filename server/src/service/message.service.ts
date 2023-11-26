import { FilterQuery } from "mongoose";
import { IMessage, Message } from "../model/message.model";

export async function createMessage({ payload }: { payload: IMessage }) {
  try {
    return await Message.create(payload);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getMessages({
  filter,
  limit = 15,
}: {
  filter: FilterQuery<IMessage>;
  limit: number;
}) {
  try {
    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    if (!messages.length) return null;
    messages.reverse();
    return messages;
  } catch (e: any) {
    throw new Error(e.message);
  }
}
