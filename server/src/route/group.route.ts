import { Router } from "express";
import requiredAccessToken from "../middleware/requiredAccessToken";
import revalidateAccessToken from "../middleware/revalidateAccessToken";
import {
  createGroupHandler,
  createGroupMembersHandler,
  getGroupsByUserIdHandler,
} from "../controller/group.controller";

export default function (route: Router) {
  route.get(
    "/api/groups/:userId",
    revalidateAccessToken,
    requiredAccessToken,
    getGroupsByUserIdHandler
  );
  route.post(
    "/api/groups/",
    revalidateAccessToken,
    requiredAccessToken,
    createGroupHandler
  );
  route.post(
    "/api/group_members/",
    revalidateAccessToken,
    requiredAccessToken,
    createGroupMembersHandler
  );
}
