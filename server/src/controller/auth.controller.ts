import { Request, Response } from "express";
import { LoginUserType } from "../schema/user.schema";
import {
  GoogleTokenResultFromCode,
  GoogleUserResult,
  findAndUpdateUser,
  getUserAccessFromCodeForGoogleOAuth,
  getUserByNameAndPassword,
  getUserFromGoogleByAccessAndRefreshToken,
} from "../service/user.service";
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
      httpOnly: true,
      domain: "localhost",
      path: "/",
      sameSite: "lax",
      secure: false,
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

export async function googleOAuthLoginHandler(req: Request, res: Response) {
  try {
    const code = req.query.code as string;

    const data =
      await getUserAccessFromCodeForGoogleOAuth<GoogleTokenResultFromCode>({
        code,
      });

    const userResult =
      await getUserFromGoogleByAccessAndRefreshToken<GoogleUserResult>({
        access_token: data.access_token,
        id_token: data.id_token,
      });

    const user = await findAndUpdateUser({
      filter: {
        name: userResult.name,
        providerName: "Google",
      },
      update: {
        name: userResult.name,
        email: userResult.email,
        picture: userResult.picture,
        providerName: "Google",
      },
      options: {
        upsert: true,
        new: true,
      },
    });

    if (!user) {
      return res
        .status(500)
        .json({ success: false, error: "Could not login with this account" })
        .end();
    }

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
      httpOnly: true,
      domain: "localhost",
      path: "/",
      sameSite: "lax",
      secure: false,
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
