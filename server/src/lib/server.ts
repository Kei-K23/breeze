import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import route from "../route";
import deserializedUser from "../middleware/deserializedUser";

dotenv.config();
const FRONTEND_URL = process.env.CORS_ORIGIN_URL;

// create express server
export function createExpressApp() {
  const app = express();

  // use middleware
  app.use(
    cors({
      origin: FRONTEND_URL,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use(deserializedUser);
  app.use(route());
  return app;
}
