import { Request, Response } from "express";
import { CreateUserType } from "../schema/user.schema";
import { createUser, getUser } from "../service/user.service";
import { omitDoc } from "../lib/helper";

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
      .status(201)
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
