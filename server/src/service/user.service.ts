import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { INotification, IUser, User, UserDoc } from "../model/user.model";
import axios from "axios";
import qs from "qs";
import mongoose from "mongoose";

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

export interface GitHubTokenResultFromCode {
  access_token: string;
  scope: string;
  token_type: string;
}

export interface GitHubUserResult {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: null;
  blog: string;
  location: string;
  email: string;
  hireable: boolean;
  bio: string;
  twitter_username: null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export async function createUser(payload: Partial<IUser>) {
  try {
    return await User.create(payload);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function editUser({
  filter,
  update,
  options,
}: {
  filter: FilterQuery<UserDoc>;
  update: UpdateQuery<UserDoc>;
  options: QueryOptions;
}) {
  try {
    return await User.findOneAndUpdate(filter, update, options);
  } catch (e: any) {
    throw new Error(e.message);
  }
}
export async function removeNotificationOfUser({
  filter,
  removeN,
}: {
  filter: FilterQuery<UserDoc>;
  removeN: INotification;
}) {
  try {
    return await User.updateOne(filter, { $pull: { notification: removeN } });
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

export async function getUserAllUserWithoutCurrentUser({
  userId,
}: {
  userId: string;
}) {
  try {
    const users = await User.find({
      _id: {
        $nin: [userId, new mongoose.Types.ObjectId("655ca25ae0c3d5a98d137825")],
      },
    })
      .select("-password")
      .lean();

    if (!users.length) {
      return null;
    }
    return users;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getAllUserWithoutCurrentUser({
  userIdArray,
}: {
  userIdArray: string[];
}) {
  try {
    const users = await User.find({
      _id: {
        $nin: [...userIdArray, "655ca25ae0c3d5a98d137825"],
      },
    })
      .select("-password")
      .lean();

    if (!users.length) {
      return null;
    }
    return users;
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

export async function getUserAccessFromCodeForGithubOAuth<T>({
  code,
}: {
  code: string;
}) {
  const rootURL = "https://github.com/login/oauth/access_token";
  const values = {
    code,
    client_id: process.env.GITHUB_CLIENT_ID as string,
    client_secret: process.env.GITHUB_CLIENT_SECRET as string,
    redirect_uri: process.env.GITHUB_REDIRECT_URL as string,
  };

  try {
    const { data } = await axios.post(rootURL, qs.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return qs.parse(data) as T;
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

export async function getUserFromGithubByAccessToken<T>({
  access_token,
}: {
  access_token: string;
}) {
  try {
    const { data } = await axios.get(`https://api.github.com/user`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
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
