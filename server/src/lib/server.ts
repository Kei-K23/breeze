import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

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
  app.use(cookieParser());

  return app;
}
