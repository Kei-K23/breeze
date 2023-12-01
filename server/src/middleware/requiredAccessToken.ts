import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../lib/jwt.utils";
import { ISession } from "../model/session.model";

export default function (req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, error: "Missing Access Token!" })
      .end();
  }

  const accessToken = authHeader?.split("Bearer ")[1];

  const decodedAccessToken = verifyJWT<{ userId: string }>({
    token: accessToken,
    secret: "ACCESS_TOKEN_SECRET",
  });

  if (!decodedAccessToken) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid Access Token!" })
      .end();
  }

  // const refreshToken = req.cookies.breeze_csrf;
  const refreshToken = req.query.breeze_csrf;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, error: "Missing Refresh Token!" })
      .end();
  }

  const decodedRefreshToken = verifyJWT<ISession>({
    token: refreshToken as string,
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

  next();
}
