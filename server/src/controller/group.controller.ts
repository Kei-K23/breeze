import { Request, Response } from "express";
import {
  createGroup,
  createGroupMembers,
  getGroupsByIds,
  getGroupsByUserId,
} from "../service/group.service";
import mongoose, { FlattenMaps, Schema } from "mongoose";
import { GetDataByUserId } from "../schema/user.schema";
import { CreateGroup, CreateGroupMembers } from "../schema/group.schema";

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
  try {
    const newCreatedGroupMembers = await createGroupMembers(req.body);

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
