import mongoose from "mongoose";

export interface IGroup {
  groupName: string;
  ownerId: mongoose.ObjectId;
  groupDescription: string;
}

export interface GroupDoc extends mongoose.Document {
  groupName: string;
  ownerId: mongoose.ObjectId;
  groupDescription: string;
}
export interface IGroupMembers {
  groupId: mongoose.ObjectId;
  memberId: mongoose.ObjectId;
  addedBy: mongoose.ObjectId;
  joinedAt: Date;
}

export interface GroupMembersDoc extends mongoose.Document {
  groupId: mongoose.ObjectId;
  memberId: mongoose.ObjectId;
  addedBy: mongoose.ObjectId;
  joinedAt: Date;
}

const groupSchema = new mongoose.Schema<GroupDoc>(
  {
    groupName: {
      type: String,
      required: true,
    },
    groupDescription: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const groupMembersSchema = new mongoose.Schema<GroupMembersDoc>(
  {
    groupId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Group",
    },
    addedBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    memberId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    joinedAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

groupMembersSchema.index({ groupId: 1, memberId: 1 }, { unique: true });

export const Group = mongoose.model<GroupDoc>("Group", groupSchema);
export const GroupMember = mongoose.model<GroupMembersDoc>(
  "GroupMember",
  groupMembersSchema
);
