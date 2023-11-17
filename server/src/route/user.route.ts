import { Router } from "express";
import { createUserHandler } from "../controller/user.controller";
import validateResource from "../middleware/validateResource";
import { createUserSchema } from "../schema/user.schema";

export default function (route: Router) {
  route.post(
    "/api/users",
    validateResource(createUserSchema),
    createUserHandler
  );
}
