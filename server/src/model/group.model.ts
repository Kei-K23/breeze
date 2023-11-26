import mongoose from "mongoose";

export interface IGroup {
  groupName: string;
  ownerId: Array<string>;
  groupDescription?: string;
  customUniqueGroupId?: string;
  groupUserNames?: Array<string>;
}

export interface GroupDoc extends mongoose.Document {
  groupName: string;
  ownerId: Array<mongoose.ObjectId>;
  groupDescription: string;
  customUniqueGroupId?: string;
  groupUserNames?: Array<string>;
}
export interface IGroupMembers {
  groupId: string;
  memberId: string;
  addedBy: string;
  joinedAt?: Date;
  status?: "Pending" | "Accept";
}

export interface GroupMembersDoc extends mongoose.Document {
  groupId: mongoose.ObjectId;
  memberId: mongoose.ObjectId;
  addedBy: mongoose.ObjectId;
  joinedAt?: Date;
  status?: string | "Pending" | "Accept";
}

const groupSchema = new mongoose.Schema<GroupDoc>(
  {
    groupName: {
      type: String,
      required: true,
    },
    groupDescription: {
      type: String,
    },
    ownerId: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      ref: "User",
    },
    customUniqueGroupId: {
      type: String,
    },
    groupUserNames: {
      type: [String],
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
    status: {
      type: String,
      default: "Pending",
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
