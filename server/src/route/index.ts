import { Router } from "express";
import userRoute from "./user.route";

const route = Router();

export default function () {
  userRoute(route);
  return route;
}
