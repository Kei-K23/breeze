import { Router } from "express";
import { getSessionHandler } from "../controller/session.controller";
import validateResource from "../middleware/validateResource";
import { getSessionSchema } from "../schema/session.schema";
import revalidateAccessToken from "../middleware/revalidateAccessToken";
import requiredAccessToken from "../middleware/requiredAccessToken";

export default function (route: Router) {
  route.get(
    "/api/session/:token_id",
    revalidateAccessToken,
    requiredAccessToken,
    validateResource(getSessionSchema),
    getSessionHandler
  );
}
