import { Router } from "express";
import validateResource from "../middleware/validateResource";
import { loginUserSchema } from "../schema/user.schema";
import { loginHandler } from "../controller/auth.controller";

export default function (route: Router) {
  route.post(
    "/api/auth/login",
    validateResource(loginUserSchema),
    loginHandler
  );
}
