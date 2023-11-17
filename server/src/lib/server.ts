import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import route from "../route";
import revalidateRefreshToken from "../middleware/revalidateRefreshToken";

dotenv.config();

// create express server
export function createExpressApp() {
  const app = express();

  // use middleware
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN_URL,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use(route());
  return app;
}
