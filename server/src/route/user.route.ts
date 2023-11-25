import { Router } from "express";
import {
  acceptFriendForUserHandler,
  addFriendForUserHandler,
  createUserHandler,
  declineFriendForUserHandler,
  editUserHandler,
  getAllUserWithoutCurrentUserHandler,
  getAuthUserHandler,
  getUserAllUserWithoutCurrentUserHandler,
  removeNotificationOfUserHandler,
} from "../controller/user.controller";
import validateResource from "../middleware/validateResource";
import {
  acceptFriendForUserSchema,
  addFriendForUserSchema,
  createUserSchema,
  declineFriendForUserSchema,
  editUserSchema,
  removeNotificationOfUserSchema,
  userIdArraySchema,
} from "../schema/user.schema";
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
    validateResource(userIdArraySchema),
    getAllUserWithoutCurrentUserHandler
  );
  route.put(
    "/api/users/:userId",
    revalidateAccessToken,
    requiredAccessToken,
    validateResource(editUserSchema),
    editUserHandler
  );
  route.put(
    "/api/users/rmN/:userId",
    revalidateAccessToken,
    requiredAccessToken,
    validateResource(removeNotificationOfUserSchema),
    removeNotificationOfUserHandler
  );
  // add friends
  route.post(
    "/api/users/add-friends/:userId",
    revalidateAccessToken,
    requiredAccessToken,
    validateResource(addFriendForUserSchema),
    addFriendForUserHandler
  );
  route.put(
    "/api/users/accept-friends/:userId",
    revalidateAccessToken,
    requiredAccessToken,
    validateResource(acceptFriendForUserSchema),
    acceptFriendForUserHandler
  );
  route.delete(
    "/api/users/decline-friends/:userId",
    revalidateAccessToken,
    requiredAccessToken,
    validateResource(declineFriendForUserSchema),
    declineFriendForUserHandler
  );
}
