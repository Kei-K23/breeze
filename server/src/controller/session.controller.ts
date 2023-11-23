import { Request, Response } from "express";
import { getSession } from "../service/session.service";
import { GetSessionType } from "../schema/session.schema";

export async function getSessionHandler(
  req: Request<GetSessionType>,
  res: Response
) {
  try {
    const session = await getSession({
      filter: {
        token_id: req.params.token_id,
      },
    });

    if (!session) {
      return res
        .status(401)
        .json({ success: false, error: "Refresh token does not exist" })
        .end();
    }

    return res
      .status(200)
      .json({
        success: true,
        data: session,
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
