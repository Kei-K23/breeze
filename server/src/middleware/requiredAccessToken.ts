import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../lib/jwt.utils";

export default function (req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, error: "Missing Access Token!" })
      .end();
  }

  const accessToken = authHeader?.split("Bearer ")[1];

  const decoded = verifyJWT<{ userId: string }>({
    token: accessToken,
    secret: "ACCESS_TOKEN_SECRET",
  });

  next();
}
