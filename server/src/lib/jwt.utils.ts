import { sign, verify, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function signJWT({
  payload,
  secret,
  options,
}: {
  payload: object;
  secret: "ACCESS_TOKEN_SECRET" | "REFRESH_TOKEN_SECRET";
  options?: SignOptions | undefined;
}) {
  const key =
    secret === "ACCESS_TOKEN_SECRET"
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET;

  return sign(payload, key as string, {
    ...(options && options),
    algorithm: "HS256",
  });
}

export function verifyJWT<T>({
  token,
  secret,
}: {
  token: string;
  secret: "ACCESS_TOKEN_SECRET" | "REFRESH_TOKEN_SECRET";
}) {
  const key =
    secret === "ACCESS_TOKEN_SECRET"
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET;

  try {
    const decoded = verify(token, key as string);

    return decoded as T;
  } catch (e: any) {
    return null;
  }
}
