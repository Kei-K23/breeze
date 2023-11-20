import mongoose, { FilterQuery, FlattenMaps, Schema } from "mongoose";
import { Group, GroupMember, IGroup } from "../model/group.model";

export async function getGroupsByUserId({ userId }: { userId: string }) {
  try {
    const groupMembers = await GroupMember.find({ memberId: userId }).lean();

    if (!groupMembers.length) return null;

    return groupMembers;
  } catch (e: any) {
    throw new Error(e.message);
  }
}
//! later user or need to delete
export async function getGroups({ filter }: { filter: FilterQuery<IGroup> }) {
  try {
    const group = await Group.findOne(filter);
    if (!group) return null;

    return group;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getGroupsByIds({
  ids,
}: {
  ids: FlattenMaps<Schema.Types.ObjectId>[];
}) {
  try {
    const groups = await Group.find({ _id: { $in: ids } }).lean();
    if (!groups) return null;

    return groups;
  } catch (e: any) {
    throw new Error(e.message);
  }
}
