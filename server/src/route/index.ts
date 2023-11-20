import { Router } from "express";
import userRoute from "./user.route";
import authRoute from "./auth.route";
import groupRoute from "./group.route";

const route = Router();

export default function () {
  userRoute(route);
  authRoute(route);
  groupRoute(route);
  return route;
}
