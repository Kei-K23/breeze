import { Router } from "express";
import validateResource from "../middleware/validateResource";
import { loginUserSchema } from "../schema/user.schema";
import {
  googleOAuthLoginHandler,
  loginHandler,
} from "../controller/auth.controller";

export default function (route: Router) {
  route.post(
    "/api/auth/login",
    validateResource(loginUserSchema),
    loginHandler
  );

  // google oauth route
  route.get("/api/session/oauth/google", googleOAuthLoginHandler);
}
