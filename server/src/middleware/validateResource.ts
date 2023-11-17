import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

export default (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (e: any) {
      return res
        .status(400)
        .json({
          success: false,
          error: JSON.parse(e.message),
          errorMessage: JSON.parse(e.message)[0].message,
        })
        .end();
    }
  };
