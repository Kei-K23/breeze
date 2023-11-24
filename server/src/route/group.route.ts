import { Router } from "express";
import requiredAccessToken from "../middleware/requiredAccessToken";
import revalidateAccessToken from "../middleware/revalidateAccessToken";
import {
  createGroupHandler,
  createGroupMembersHandler,
  deleteGroupHandler,
  deleteGroupMemberHandler,
  editGroupMemberHandler,
  getGroupByIdHandler,
  getGroupsByUserIdHandler,
} from "../controller/group.controller";
import validateResource from "../middleware/validateResource";
import {
  createGroup,
  createGroupMembers,
  deleteGroupMemberSchema,
  deleteGroupSchema,
  getDataByIdSchema,
  getDataByUserId,
} from "../schema/group.schema";

export default function (route: Router) {
  route.get(
    "/api/groups/:userId",
    revalidateAccessToken,
    requiredAccessToken,
    validateResource(getDataByUserId),
    getGroupsByUserIdHandler
  );
  route.get(
    "/api/groups/",
    revalidateAccessToken,
    requiredAccessToken,
    validateResource(getDataByIdSchema),
    getGroupByIdHandler
  );
  route.post(
    "/api/groups/",
    revalidateAccessToken,
    requiredAccessToken,
    validateResource(createGroup),
    createGroupHandler
  );
  route.post(
    "/api/group_members/",
    revalidateAccessToken,
    requiredAccessToken,
    // validateResource(createGroupMembers),
    createGroupMembersHandler
  );
  route.put(
    "/api/groups/:groupMemberId",
    revalidateAccessToken,
    requiredAccessToken,
    editGroupMemberHandler
  );
  route.delete(
    "/api/groups_members/",
    revalidateAccessToken,
    requiredAccessToken,
    validateResource(deleteGroupMemberSchema),
    deleteGroupMemberHandler
  );
  route.delete(
    "/api/groups/:_id/:ownerId",
    revalidateAccessToken,
    requiredAccessToken,
    validateResource(deleteGroupSchema),
    deleteGroupHandler
  );
}
