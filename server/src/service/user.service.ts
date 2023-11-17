import { IUser, User } from "../model/user.model";

export async function createUser(payload: Partial<IUser>) {
  try {
    return await User.create(payload);
  } catch (e: any) {
    throw new Error(e.message);
  }
}
