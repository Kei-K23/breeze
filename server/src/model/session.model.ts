import mongoose from "mongoose";

export interface ISession {
  _id?: string;
  userId: string;
  email: string;
  picture: string;
  token_id: string;
  is_valid?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SessionDoc extends mongoose.Document {
  _id?: string;
  userId: string;
  email: string;
  token_id: string;
  picture: string;
  is_valid?: boolean;
  createdAt?: Date;
  updatedA?: Date;
}

const sessionSchema = new mongoose.Schema<SessionDoc>(
  {
    userId: {
      type: String,
      required: true,
    },
    is_valid: {
      type: Boolean,
      default: true,
    },
    email: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    token_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Session = mongoose.model("Session", sessionSchema);
