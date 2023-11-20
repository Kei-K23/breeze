"use server";

import { revalidatePath } from "next/cache";

export async function createGroup({
  values,
  currentUserId,
  cookie,
}: {
  values: {
    groupName: string;
    groupDescription?: string;
  };
  currentUserId: string;
  cookie: string;
}) {
  try {
    const resGroupDate = await fetch("http://localhost:8090/api/groups/", {
      method: "POST",
      body: JSON.stringify({
        groupName: values.groupName,
        groupDescription: values.groupDescription,
        ownerId: currentUserId,
      }),
      headers: {
        Cookie: `breeze_csrf=${cookie}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      next: {
        revalidate: 0,
      },
    });

    const groupData = await resGroupDate.json();

    await fetch("http://localhost:8090/api/group_members/", {
      method: "POST",
      body: JSON.stringify({
        groupId: groupData.data._id,
        addedBy: currentUserId,
        memberId: currentUserId,
      }),
      headers: {
        Cookie: `breeze_csrf=${cookie}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      next: {
        revalidate: 0,
      },
    });
    revalidatePath("/");
  } catch (e: any) {
    console.log(e.message);
    revalidatePath("/");
    throw new Error(e);
  }
}
