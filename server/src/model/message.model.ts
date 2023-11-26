import mongoose from "mongoose";

export interface IMessage {
  senderId: string;
  receiverId: Array<string>;
  groupId: string;
  textMessage: string;
  isRead?: boolean;
}
export interface MessageDoc extends mongoose.Document {
  senderId: mongoose.Schema.Types.ObjectId;
  receiverId: Array<mongoose.Schema.Types.ObjectId>;
  groupId: string;
  textMessage: string;
  isRead?: boolean;
}

const messageSchema = new mongoose.Schema<MessageDoc>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiverId: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
    },
    groupId: {
      type: String,
      required: true,
    },
    textMessage: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
