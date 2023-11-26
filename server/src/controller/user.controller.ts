import { Request, Response } from "express";
import {
  AcceptFriendForUserType,
  AddFriendForUserType,
  CreateUserType,
  DeclineFriendForUserType,
  EditUserType,
  RemoveNotificationOfUserType,
  UserIdArrayType,
} from "../schema/user.schema";
import {
  createUser,
  editUser,
  getAllUserWithoutCurrentUser,
  getUser,
  getUserAllUserWithoutCurrentUser,
  removeNotificationOfUser,
} from "../service/user.service";
import { omitDoc } from "../lib/helper";
import { GetDataByUserId } from "../schema/group.schema";
import { INotification } from "../model/user.model";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserType>,
  res: Response
) {
  try {
    const user = await createUser(req.body);

    return res
      .status(201)
      .json({
        success: true,
        data: omitDoc(user, ["password", "__v"]),
        message: "Successfully register!",
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

export async function editUserHandler(
  req: Request<EditUserType["params"], {}, EditUserType["body"]>,
  res: Response
) {
  const userId = req.params.userId;
  try {
    const user = await editUser({
      filter: {
        _id: userId,
      },
      update: {
        name: req.body.name,
        email: req.body.email,
        $push: { notification: req.body.notification },
      },
      options: {
        new: true,
      },
    });

    if (!user) {
      return res
        .status(500)
        .json({
          success: false,
          error: "Could not update user data!",
        })
        .end();
    }

    return res
      .status(200)
      .json({
        success: true,
        data: omitDoc(user, ["password", "__v"]),
        message: "Successfully register!",
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

export async function addFriendForUserHandler(
  req: Request<
    AddFriendForUserType["params"],
    {},
    AddFriendForUserType["body"]
  >,
  res: Response
) {
  const userId = req.params.userId;
  try {
    const user = await editUser({
      filter: {
        _id: userId,
      },
      update: {
        $push: { friends: req.body.friendIds },
      },
      options: {
        new: true,
      },
    });

    if (!user) {
      return res
        .status(500)
        .json({
          success: false,
          error: "Could not add friend!",
        })
        .end();
    }

    return res
      .status(200)
      .json({
        success: true,
        data: omitDoc(user, ["password", "__v"]),
        message: "Friend Request !",
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

export async function acceptFriendForUserHandler(
  req: Request<
    AcceptFriendForUserType["params"],
    {},
    AcceptFriendForUserType["body"]
  >,
  res: Response
) {
  const userId = req.params.userId;
  try {
    const user = await editUser({
      filter: {
        _id: userId,
        "friends.friendId": req.body.friendId,
      },
      update: {
        "friends.$.status": req.body.status || "Friended",
        "friends.$.customUniqueGroupId": req.body.customUniqueGroupId,
        "friends.$.groupId": req.body.groupId,
      },
      options: {
        new: true,
        upsert: true,
      },
    });

    if (!user) {
      return res
        .status(500)
        .json({
          success: false,
          error: "Could not accept friend!",
        })
        .end();
    }

    return res
      .status(200)
      .json({
        success: true,
        data: omitDoc(user, ["password", "__v"]),
        message: "Successfully accept the friend !",
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

export async function declineFriendForUserHandler(
  req: Request<
    DeclineFriendForUserType["params"],
    {},
    DeclineFriendForUserType["body"]
  >,
  res: Response
) {
  const userId = req.params.userId;
  try {
    const user = await editUser({
      filter: {
        _id: userId,
        "friends.friendId": req.body.friendId,
      },
      update: {
        $pull: { friends: { friendId: req.body.friendId } },
      },
      options: {
        new: true,
      },
    });

    if (!user) {
      return res
        .status(500)
        .json({
          success: false,
          error: "Something went wrong! Could not decline friend request. ",
        })
        .end();
    }

    return res
      .status(200)
      .json({
        success: true,
        data: omitDoc(user, ["password", "__v"]),
        message: "Successfully decline the friend request !",
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

export async function removeNotificationOfUserHandler(
  req: Request<
    RemoveNotificationOfUserType["params"],
    {},
    RemoveNotificationOfUserType["body"]
  >,
  res: Response
) {
  const userId = req.params.userId;
  try {
    const user = await removeNotificationOfUser({
      filter: {
        _id: userId,
      },
      removeN: req.body as INotification,
    });

    if (!user) {
      return res
        .status(500)
        .json({
          success: false,
          error: "Could not update user data!",
        })
        .end();
    }

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

export async function getUserAllUserWithoutCurrentUserHandler(
  req: Request<GetDataByUserId>,
  res: Response
) {
  try {
    const userId = req.params.userId;
    const users = await getUserAllUserWithoutCurrentUser({ userId });

    if (!users?.length)
      return res
        .status(400)
        .json({
          success: false,
          error: "Could not find users!",
        })
        .end();

    return res
      .status(200)
      .json({
        success: true,
        data: users,
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

export async function getAllUserWithoutCurrentUserHandler(
  req: Request<{}, {}, UserIdArrayType>,
  res: Response
) {
  try {
    const users = await getAllUserWithoutCurrentUser({
      userIdArray: req.body.userIdArray as unknown as string[],
    });

    if (!users?.length)
      return res
        .status(400)
        .json({
          success: false,
          error: "Could not find users!",
        })
        .end();

    return res
      .status(200)
      .json({
        success: true,
        data: users,
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

export async function getAuthUserHandler(req: Request, res: Response) {
  const userId = res.locals.userId;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, error: "Missing user Id" })
      .end();
  }

  try {
    const user = await getUser({
      filter: {
        _id: userId,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Could not find authorized user!" })
        .end();
    }

    return res
      .status(200)
      .json({
        success: true,
        data: omitDoc(user, ["password", "__v"]),
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
