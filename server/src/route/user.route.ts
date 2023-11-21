import { Router } from "express";
import {
  createUserHandler,
  getAllUserWithoutCurrentUserHandler,
  getAuthUserHandler,
  getUserAllUserWithoutCurrentUserHandler,
} from "../controller/user.controller";
import validateResource from "../middleware/validateResource";
import { createUserSchema, userIdArraySchema } from "../schema/user.schema";
import requiredAccessToken from "../middleware/requiredAccessToken";
import revalidateAccessToken from "../middleware/revalidateAccessToken";
import { getDataByUserId } from "../schema/group.schema";

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
  route.get(
    "/api/users/:userId",
    revalidateAccessToken,
    requiredAccessToken,
    validateResource(getDataByUserId),
    getUserAllUserWithoutCurrentUserHandler
  );
  route.post(
    "/api/users/without",
    revalidateAccessToken,
    requiredAccessToken,
    // validateResource(userIdArraySchema),
    getAllUserWithoutCurrentUserHandler
  );
}
