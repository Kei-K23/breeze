import mongoose from "mongoose";

export interface IGroup {
  groupName: string;
  ownerId: string;
  groupDescription: string;
}

export interface GroupDoc extends mongoose.Document {
  groupName: string;
  ownerId: string;
  groupDescription: string;
}
export interface IGroupMembers {
  groupId: string;
  memberId: string;
  addedBy: string;
  joinedAt: Date;
}

export interface GroupMembersDoc extends mongoose.Document {
  groupId: string;
  memberId: string;
  addedBy: string;
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
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const groupMembersSchema = new mongoose.Schema<GroupMembersDoc>(
  {
    groupId: {
      type: String,
      required: true,
    },
    addedBy: {
      type: String,
      required: true,
    },
    memberId: {
      type: String,
      required: true,
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

export const Group = mongoose.model<GroupDoc>("Group", groupSchema);
export const GroupMember = mongoose.model<GroupMembersDoc>(
  "GroupMember",
  groupMembersSchema
);
