import { Request, Response } from "express";
import { GetGroupsByUserId } from "../schema/group.schema";
import { getGroupsByIds, getGroupsByUserId } from "../service/group.service";
import { FlattenMaps, Schema } from "mongoose";

export async function getGroupsByUserIdHandler(
  req: Request<GetGroupsByUserId>,
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
          error: "Could not found group's members",
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
