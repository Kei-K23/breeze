import { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
  const accessToken = req.headers.authorization;

  console.log(accessToken);

  next();
}
