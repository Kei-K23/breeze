import { Request, Response } from "express";
import { LoginUserType } from "../schema/user.schema";
import {
  GitHubTokenResultFromCode,
  GitHubUserResult,
  GoogleTokenResultFromCode,
  GoogleUserResult,
  findAndUpdateUser,
  getUserAccessFromCodeForGithubOAuth,
  getUserAccessFromCodeForGoogleOAuth,
  getUserByNameAndPassword,
  getUserFromGithubByAccessToken,
  getUserFromGoogleByAccessAndRefreshToken,
} from "../service/user.service";
import { omitDoc } from "../lib/helper";
import {
  createAccessToken,
  createRefreshToken,
  editSession,
} from "../service/session.service";
import { verifyJWT } from "../lib/jwt.utils";
import { ISession } from "../model/session.model";
import { createAddGroupMember } from "../service/group.service";
import mongoose from "mongoose";

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

    await createAddGroupMember({
      filter: {
        memberId: user._id,
        addedBy: new mongoose.Types.ObjectId("655ca25ae0c3d5a98d137825"),
        groupId: new mongoose.Types.ObjectId("655ca2c81733353ac0d565f1"),
      },
      update: {
        memberId: user._id,
        addedBy: new mongoose.Types.ObjectId("655ca25ae0c3d5a98d137825"),
        groupId: new mongoose.Types.ObjectId("655ca2c81733353ac0d565f1"),
      },
      options: {
        upsert: true,
        new: true,
      },
    });

    return res.redirect("http://localhost:3000/dashboard");
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

export async function githubOAuthLoginHandler(req: Request, res: Response) {
  try {
    const code = req.query.code as string;

    const data =
      await getUserAccessFromCodeForGithubOAuth<GitHubTokenResultFromCode>({
        code,
      });

    const userResult = await getUserFromGithubByAccessToken<GitHubUserResult>({
      access_token: data.access_token,
    });

    const user = await findAndUpdateUser({
      filter: {
        name: userResult.name,
        providerName: "Github",
      },
      update: {
        name: userResult.name,
        email: userResult.email,
        picture: userResult.avatar_url,
        providerName: "Github",
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

    await createAddGroupMember({
      filter: {
        memberId: user._id,
        addedBy: new mongoose.Types.ObjectId("655ca25ae0c3d5a98d137825"),
        groupId: new mongoose.Types.ObjectId("655ca2c81733353ac0d565f1"),
      },
      update: {
        memberId: user._id,
        addedBy: new mongoose.Types.ObjectId("655ca25ae0c3d5a98d137825"),
        groupId: new mongoose.Types.ObjectId("655ca2c81733353ac0d565f1"),
      },
      options: {
        upsert: true,
        new: true,
      },
    });

    return res.redirect("http://localhost:3000/dashboard");
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

export async function logOutHandler(req: Request, res: Response) {
  const refreshToken = req.cookies.breeze_csrf;
  const decodedRefreshToken = verifyJWT<ISession>({
    token: refreshToken,
    secret: "REFRESH_TOKEN_SECRET",
  });

  try {
    await editSession({
      filter: { is_valid: true, token_id: decodedRefreshToken?.token_id },
      update: {
        is_valid: false,
      },
    });

    req.headers.authorization = "";
    res.clearCookie("breeze_csrf");
    return res.redirect("http://localhost:3000/");
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
