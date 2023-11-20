import { Router } from "express";
import requiredAccessToken from "../middleware/requiredAccessToken";
import revalidateAccessToken from "../middleware/revalidateAccessToken";
import { getGroupsByUserIdHandler } from "../controller/group.controller";

export default function (route: Router) {
  route.get(
    "/api/groups/:userId",
    revalidateAccessToken,
    requiredAccessToken,
    getGroupsByUserIdHandler
  );
}
