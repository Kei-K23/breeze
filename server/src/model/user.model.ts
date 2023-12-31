import mongoose from "mongoose";
import argon2 from "argon2";
import { GroupMember } from "./group.model";

export interface INotification {
  title: string;
  content: string;
  sourceIdToConfirm?: string; /// confirmation id
  senderId: string;
  senderName: string;
  createdAt: Date;
  groupId?: string;
  checkUnique?: string;
  receiverId?: string;
  senderEmail?: string;
  senderPicture?: string;
  customUniqueGroupId?: string;
}

export type FriendDataType = {
  friendId: string;
  status: "Pending" | "Friended";
  email: string;
  picture: string;
  name: string;
  customUniqueGroupId?: string;
  groupId?: string;
};
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  picture: string;
  created_at: Date;
  updated_at: Date;
  providerName: "Credentials" | "Google" | "Github";
  notification?: Array<INotification>;
  friends?: Array<FriendDataType>;
}

const NotificationSchema = new mongoose.Schema<INotification>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  sourceIdToConfirm: { type: String },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  createdAt: { type: Date, default: new Date() },
  checkUnique: { type: String },
  groupId: { type: String },
  receiverId: { type: String },
  senderEmail: { type: String },
  senderPicture: { type: String },
  customUniqueGroupId: { type: String },
});

export interface UserDoc extends mongoose.Document {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  picture: string;
  created_at: Date;
  updated_at: Date;
  providerName: "Credentials" | "Google" | "Github";
  notification?: Array<INotification>;
  friends?: Array<FriendDataType>;
}

interface UserModel extends mongoose.Model<UserDoc> {
  verifyPassword: ({
    candidatePass,
    password,
  }: {
    candidatePass: string;
    password: string;
  }) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDoc, UserModel>(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: async function (name: string) {
          const user = await User.findOne({ name });
          if (user) {
            return false;
          }
          return true;
        },
        message: (data) =>
          `${data.value} is already exist! Name must be unique`,
      },
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (pass: string) {
          const passwordRegex =
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{6,}$/;

          return passwordRegex.test(pass);
        },
        message: (data) =>
          `${data.value} is invalid format. Password must be at least 6 character long, contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character `,
      },
    },
    picture: {
      type: String,
    },
    providerName: {
      type: String,
      default: "Credentials",
    },
    notification: {
      type: [NotificationSchema],
      default: [],
    },
    friends: {
      type: [
        {
          friendId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
          },
          status: { type: String, default: "Pending" },
          email: { type: String },
          picture: { type: String },
          name: { type: String },
          customUniqueGroupId: { type: String },
          groupId: { type: String },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  const hashPassword = await argon2.hash(this.password as string);
  this.password = hashPassword;
  await GroupMember.create({
    groupId: "655ca2c81733353ac0d565f1",
    memberId: this._id,
    addedBy: "655ca25ae0c3d5a98d137825",
    joinedAt: new Date(),
    status: "Accept",
  });
});

userSchema.static(
  "verifyPassword",
  async function ({
    candidatePass,
    password,
  }: {
    candidatePass: string;
    password: string;
  }) {
    return await argon2.verify(password, candidatePass);
  }
);

export const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
