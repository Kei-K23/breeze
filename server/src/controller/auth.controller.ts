import { Request, Response } from "express";
import { LoginUserType } from "../schema/user.schema";
import { getUserByNameAndPassword } from "../service/user.service";
import { omitDoc } from "../lib/helper";

export async function loginHandler(
  req: Request<{}, {}, LoginUserType>,
  res: Response
) {
  try {
    const user = await getUserByNameAndPassword(req.body);

    return res
      .status(200)
      .json({
        success: true,
        data: omitDoc(user, ["password", "__v"]),
        message: "Successfully login!",
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
