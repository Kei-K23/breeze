import { Request, Response } from "express";
import {
  createMessage,
  deleteMessages,
  getMessages,
} from "../service/message.service";
import {
  CreateMessageType,
  DeleteMessagesType,
  GetMessagesType,
} from "../schema/message.schema";

export async function createMessageHandler(
  req: Request<{}, {}, CreateMessageType>,
  res: Response
) {
  try {
    const message = await createMessage({ payload: req.body });

    return res
      .status(201)
      .json({
        success: true,
        data: message,
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

export async function getMessagesHandler(
  req: Request<GetMessagesType["params"], {}, {}, GetMessagesType["query"]>,
  res: Response
) {
  try {
    const messages = await getMessages({
      filter: {
        groupId: req.params.groupId,
      },
      limit: +req.query.limit,
    });

    if (!messages)
      return res
        .status(404)
        .json({
          success: false,
          error: "Not send messages!",
        })
        .end();

    return res
      .status(201)
      .json({
        success: true,
        data: messages,
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

export async function deleteMessagesHandler(
  req: Request<{}, {}, DeleteMessagesType>,
  res: Response
) {
  try {
    await deleteMessages({
      filter: req.body,
    });

    return res
      .status(200)
      .json({
        success: true,
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
