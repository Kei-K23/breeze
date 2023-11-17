import { Request, Response } from "express";
import { CreateUserType } from "../schema/user.schema";
import { createUser } from "../service/user.service";
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
