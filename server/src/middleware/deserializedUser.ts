import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../lib/jwt.utils";

export default function (req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }

  const accessToken = authHeader?.split("Bearer ")[1];

  const decoded = verifyJWT<{ userId: string }>({
    token: accessToken,
    secret: "ACCESS_TOKEN_SECRET",
  });

  if (!decoded) {
    return next();
  }

  res.locals.userId = decoded.userId;

  next();
}
