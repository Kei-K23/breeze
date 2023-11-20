import {
  FilterQuery,
  FlattenMaps,
  QueryOptions,
  Schema,
  UpdateQuery,
} from "mongoose";
import {
  Group,
  GroupMember,
  IGroup,
  IGroupMembers,
} from "../model/group.model";

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

export async function createGroup(payload: IGroup) {
  try {
    return Group.create(payload);
  } catch (e: any) {
    throw new Error(e.message);
  }
}
export async function createGroupMembers(payload: IGroupMembers) {
  try {
    return GroupMember.create(payload);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function createAddGroupMember({
  filter,
  update,
  options,
}: {
  filter: FilterQuery<IGroupMembers>;
  update: UpdateQuery<IGroupMembers>;
  options: QueryOptions;
}) {
  try {
    return await GroupMember.findOneAndUpdate(filter, update, options);
  } catch (e: any) {
    throw new Error(e.message);
  }
}
