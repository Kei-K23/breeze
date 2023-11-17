import { Request, Response } from "express";
import { LoginUserType } from "../schema/user.schema";
import { getUserByNameAndPassword } from "../service/user.service";
import { omitDoc } from "../lib/helper";
import {
  createAccessToken,
  createRefreshToken,
} from "../service/session.service";

export async function loginHandler(
  req: Request<{}, {}, LoginUserType>,
  res: Response
) {
  try {
    const user = await getUserByNameAndPassword(req.body);

    const accessToken = createAccessToken({
      userId: user._id.toString(),
      is_valid: true,
      email: user.email,
      picture: user.picture,
    });

    const refreshToken = await createRefreshToken({
      userId: user._id.toString(),
      is_valid: true,
      token_id: crypto.randomUUID().toString(),
      email: user.email,
      picture: user.picture,
    });

    res.cookie("breeze_csrf", refreshToken, {
      path: "/",
      httpOnly: true,
      domain: "localhost",
      maxAge: 5.184e9,
    });

    return res
      .status(200)
      .json({
        success: true,
        data: omitDoc(user, ["password", "__v"]),
        message: "Successfully login!",
        accessToken,
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
