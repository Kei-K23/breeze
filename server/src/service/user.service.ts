import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { IUser, User } from "../model/user.model";
import axios from "axios";
import qs from "qs";

export interface GoogleTokenResultFromCode {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
}

export interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export async function createUser(payload: Partial<IUser>) {
  try {
    return await User.create(payload);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getUserByNameAndPassword({
  name,
  password,
}: {
  name: string;
  password: string;
}) {
  try {
    const user = await User.findOne({ name });

    if (!user) {
      throw new Error(`Could not find the user with name ${name}`);
    }

    const isAuth = await User.verifyPassword({
      candidatePass: password,
      password: user.password as string,
    });

    if (!isAuth) {
      throw new Error(`Invalid password!`);
    }

    return user;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getUser({ filter }: { filter: FilterQuery<IUser> }) {
  try {
    const user = await User.findOne(filter);

    if (!user) {
      return null;
    }
    return user;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getUserAccessFromCodeForGoogleOAuth<T>({
  code,
}: {
  code: string;
}) {
  const rootURL = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirect_uri: process.env.GOOGLE_REDIRECT_URL as string,
    grant_type: "authorization_code",
  };

  try {
    const { data } = await axios.post(rootURL, qs.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return data as T;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getUserFromGoogleByAccessAndRefreshToken<T>({
  access_token,
  id_token,
}: {
  access_token: string;
  id_token: string;
}) {
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return data as T;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function findAndUpdateUser({
  filter,
  update,
  options,
}: {
  filter: FilterQuery<IUser>;
  update: UpdateQuery<IUser>;
  options: QueryOptions;
}) {
  try {
    return await User.findOneAndUpdate(filter, update, options);
  } catch (e: any) {
    throw new Error(e.message);
  }
}
