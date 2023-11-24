import { Router } from "express";
import userRoute from "./user.route";
import authRoute from "./auth.route";
import groupRoute from "./group.route";
import sessionRoute from "./session.route";

const route = Router();

export default function () {
  userRoute(route);
  authRoute(route);
  groupRoute(route);
  sessionRoute(route);
  return route;
}
