import { Router } from "express";
import {
  createUserHandler,
  getAuthUserHandler,
} from "../controller/user.controller";
import validateResource from "../middleware/validateResource";
import { createUserSchema } from "../schema/user.schema";
import requiredAccessToken from "../middleware/requiredAccessToken";
import revalidateAccessToken from "../middleware/revalidateAccessToken";

export default function (route: Router) {
  route.post(
    "/api/users",
    validateResource(createUserSchema),
    createUserHandler
  );
  route.get(
    "/api/users",
    revalidateAccessToken,
    requiredAccessToken,
    getAuthUserHandler
  );
}
