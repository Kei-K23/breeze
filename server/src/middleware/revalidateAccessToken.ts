import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../lib/jwt.utils";
import { ISession } from "../model/session.model";
import { createAccessToken, getSession } from "../service/session.service";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const refreshToken = req.cookies.breeze_csrf;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, error: "Missing Refresh Token!" })
      .end();
  }

  const accessToken = req.headers.authorization?.split("Bearer ")[1];

  const decodedAccessToken = verifyJWT<{ userId: string }>({
    token: accessToken as string,
    secret: "ACCESS_TOKEN_SECRET",
  });

  if (decodedAccessToken) {
    return next();
  }

  const decodedRefreshToken = verifyJWT<ISession>({
    token: refreshToken,
    secret: "REFRESH_TOKEN_SECRET",
  });

  if (!decodedRefreshToken) {
    return res
      .status(401)
      .json({
        success: false,
        error: "Invalid Refresh Token! Login again",
      })
      .end();
  }

  const validSession = await getSession({
    filter: {
      token_id: decodedRefreshToken.token_id,
    },
  });

  if (!validSession) {
    return res
      .status(401)
      .json({ success: false, error: "Missing Refresh Token! Login again" })
      .end();
  }

  if (!validSession.is_valid) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid Refresh Token! Login again" })
      .end();
  }

  const newAccessToken = createAccessToken({
    userId: decodedRefreshToken.userId.toString(),
    is_valid: true,
    email: decodedRefreshToken.email,
    picture: decodedRefreshToken.picture,
  });

  req.headers.authorization = "";
  req.headers.authorization = `Bearer ${newAccessToken}`;
  res.locals.userId = decodedRefreshToken.userId.toString();
  return next();
}
