import { Request, Response } from "express";
import {
  createGroup,
  createGroupMembers,
  deleteGroup,
  deleteGroupMember,
  editGroupMember,
  getGroups,
  getGroupsByIds,
  getGroupsByUserId,
  getMembersByGroupIds,
} from "../service/group.service";
import { FlattenMaps, Schema } from "mongoose";
import {
  CreateGroup,
  CreateGroupMembers,
  DeleteGroupMemberType,
  DeleteGroupType,
  EditGroupMemberType,
  GetDataByIdType,
  GetDataByUserId,
} from "../schema/group.schema";

export async function getGroupsByUserIdHandler(
  req: Request<GetDataByUserId>,
  res: Response
) {
  try {
    const userId = req.params.userId;

    const groupMembers = await getGroupsByUserId({ userId });

    if (!groupMembers?.length)
      return res
        .status(400)
        .json({
          success: false,
          error: "Could not find group's members",
        })
        .end();

    const groupsId = groupMembers?.reduce(
      (acc: Array<FlattenMaps<Schema.Types.ObjectId>>, curr) => {
        const id = curr.groupId;

        acc.push(id);

        return acc;
      },
      []
    );

    const groups = await getGroupsByIds({ ids: groupsId });

    return res
      .status(200)
      .json({
        success: true,
        data: groups,
      })
      .end();
  } catch (e: any) {
    return res
      .status(500)
      .json({
        success: false,
        error: e.message,
      })
      .end();
  }
}

export async function getGroupByIdHandler(
  req: Request<{}, {}, {}, GetDataByIdType>,
  res: Response
) {
  try {
    const groupId = req.query.groupId;
    const groupIdForMembers = req.query.groupIdForMembers;

    if (groupId) {
      const group = await getGroups({
        filter: {
          _id: groupId,
        },
      });

      if (!group)
        return res
          .status(400)
          .json({
            success: false,
            error: "Could not find the group",
          })
          .end();

      return res
        .status(200)
        .json({
          success: true,
          data: group,
        })
        .end();
    }

    if (groupIdForMembers) {
      const members = await getMembersByGroupIds({
        groupId: groupIdForMembers,
      });

      return res
        .status(200)
        .json({
          success: true,
          data: members,
        })
        .end();
    }
  } catch (e: any) {
    return res
      .status(500)
      .json({
        success: false,
        error: e.message,
      })
      .end();
  }
}

export async function createGroupHandler(
  req: Request<{}, {}, CreateGroup>,
  res: Response
) {
  try {
    const newCreatedGroup = await createGroup(req.body);

    return res
      .status(201)
      .json({
        success: true,
        data: newCreatedGroup,
        message: "Successfully created new Group",
      })
      .end();
  } catch (e: any) {
    return res
      .status(500)
      .json({
        success: false,
        error: e.message,
      })
      .end();
  }
}

export async function createGroupMembersHandler(
  req: Request<{}, {}, CreateGroupMembers>,
  res: Response
) {
  const groupMember = req.body.groupMembers;
  try {
    const newCreatedGroupMembers = await createGroupMembers(groupMember);

    return res
      .status(201)
      .json({
        success: true,
        data: newCreatedGroupMembers,
      })
      .end();
  } catch (e: any) {
    return res
      .status(500)
      .json({
        success: false,
        error: e.message,
      })
      .end();
  }
}

export async function editGroupMemberHandler(
  req: Request<EditGroupMemberType["params"], {}, EditGroupMemberType["body"]>,
  res: Response
) {
  const groupMemberId = req.params.groupMemberId;
  try {
    const groupMember = await editGroupMember({
      filter: {
        _id: groupMemberId,
      },
      update: req.body,
      options: {
        new: true,
      },
    });

    if (!groupMember) {
      return res
        .status(500)
        .json({
          success: false,
          error: "Something went wrong!",
        })
        .end();
    }

    return res
      .status(201)
      .json({
        success: true,
        data: groupMember,
      })
      .end();
  } catch (e: any) {
    return res
      .status(500)
      .json({
        success: false,
        error: e.message,
      })
      .end();
  }
}

export async function deleteGroupMemberHandler(
  req: Request<{}, {}, DeleteGroupMemberType>,
  res: Response
) {
  try {
    await deleteGroupMember({
      filter: req.body,
    });

    return res
      .status(200)
      .json({
        success: true,
      })
      .end();
  } catch (e: any) {
    return res
      .status(500)
      .json({
        success: false,
        error: e.message,
      })
      .end();
  }
}

export async function deleteGroupHandler(
  req: Request<DeleteGroupType>,
  res: Response
) {
  try {
    await deleteGroup({
      filter: req.params,
    });

    return res
      .status(200)
      .json({
        success: true,
      })
      .end();
  } catch (e: any) {
    return res
      .status(500)
      .json({
        success: false,
        error: e.message,
      })
      .end();
  }
}
