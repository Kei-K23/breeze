import mongoose from "mongoose";
import argon2 from "argon2";
import { GroupMember } from "./group.model";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  picture: string;
  created_at: Date;
  updated_at: Date;
  providerName: "Credentials" | "Google" | "Github";
}

interface UserDoc extends mongoose.Document {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  picture: string;
  created_at: Date;
  updated_at: Date;
  providerName: "Credentials" | "Google" | "Github";
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
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  const hashPassword = await argon2.hash(this.password as string);
  this.password = hashPassword;
  await GroupMember.create({
    groupId: "655a268472a58dfa3fc5c7e0",
    memberId: this._id,
    addedBy: "655a261a8d20f123d6b4bcba",
    joinedAt: new Date(),
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
