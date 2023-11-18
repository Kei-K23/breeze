import { Router } from "express";
import validateResource from "../middleware/validateResource";
import { loginUserSchema } from "../schema/user.schema";
import {
  googleOAuthLoginHandler,
  logOutHandler,
  loginHandler,
} from "../controller/auth.controller";
import revalidateAccessToken from "../middleware/revalidateAccessToken";
import requiredAccessToken from "../middleware/requiredAccessToken";

export default function (route: Router) {
  route.post(
    "/api/auth/login",
    validateResource(loginUserSchema),
    loginHandler
  );

  // google oauth route
  route.get("/api/session/oauth/google", googleOAuthLoginHandler);

  // logout
  route.get(
    "/api/auth/logout",
    revalidateAccessToken,
    requiredAccessToken,
    logOutHandler
  );
}
