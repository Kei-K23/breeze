import { Router } from "express";
import userRoute from "./user.route";
import authRoute from "./auth.route";

const route = Router();

export default function () {
  userRoute(route);
  authRoute(route);
  return route;
}
