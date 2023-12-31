import { Router } from "express";
import {
  createMessageHandler,
  deleteMessagesHandler,
  getMessagesHandler,
} from "../controller/message.controller";
import validateResource from "../middleware/validateResource";
import {
  createMessageSchema,
  deleteMessagesSchema,
  getMessagesSchema,
} from "../schema/message.schema";
import revalidateAccessToken from "../middleware/revalidateAccessToken";
import requiredAccessToken from "../middleware/requiredAccessToken";

export default function (route: Router) {
  route.post(
    "/api/messages/",
    revalidateAccessToken,
    requiredAccessToken,
    validateResource(createMessageSchema),
    createMessageHandler
  );
  route.get(
    "/api/messages/:groupId",
    revalidateAccessToken,
    requiredAccessToken,
    validateResource(getMessagesSchema),
    getMessagesHandler
  );
  route.delete(
    "/api/messages/",
    revalidateAccessToken,
    requiredAccessToken,
    validateResource(deleteMessagesSchema),
    deleteMessagesHandler
  );
}
