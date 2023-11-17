import { FilterQuery } from "mongoose";
import { IUser, User } from "../model/user.model";

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
