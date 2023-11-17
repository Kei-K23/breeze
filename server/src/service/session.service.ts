import { signJWT } from "../lib/jwt.utils";
import { ISession, Session } from "../model/session.model";

export async function createSession(payload: Partial<ISession>) {
  try {
    return await Session.create(payload);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export function createAccessToken(payload: Partial<ISession>) {
  try {
    const accessToken = signJWT({
      payload,
      secret: "ACCESS_TOKEN_SECRET",
      options: {
        expiresIn: 60000,
      },
    });

    return accessToken;
  } catch (e: any) {
    throw new Error(e.message);
  }
}
export async function createRefreshToken(payload: Partial<ISession>) {
  try {
    const session = await createSession(payload);

    const refreshToken = signJWT({
      payload: {
        userId: session.userId,
        is_valid: session.is_valid,
        token_id: session.token_id,
        email: session.email,
        picture: session.picture,
      },
      secret: "REFRESH_TOKEN_SECRET",
      options: {
        expiresIn: 5.256e9,
      },
    });

    return refreshToken;
  } catch (e: any) {
    throw new Error(e.message);
  }
}
