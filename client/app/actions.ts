"use server";

import { revalidatePath } from "next/cache";
import { UserType } from "./(dashboard)/_components/RightSideBar";

export async function createGroup({
  values,
  currentUserId,
  cookie,
  selectedUsers,
}: {
  values: {
    groupName: string;
    groupDescription?: string;
  };
  currentUserId: string;
  cookie: string;
  selectedUsers: UserType[];
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

    await createGroupMember({
      cookie,
      values: {
        addedBy: currentUserId,
        memberId: currentUserId,
        groupId: groupData.data._id,
      },
    });

    if (selectedUsers.length) {
      selectedUsers.map(async (user) => {
        await createGroupMember({
          cookie,
          values: {
            addedBy: currentUserId,
            memberId: user._id,
            groupId: groupData.data._id,
          },
        });
      });
    }

    revalidatePath("/");
  } catch (e: any) {
    revalidatePath("/");
    throw new Error(e.message);
  }
}

export async function createGroupMember({
  values,
  cookie,
}: {
  cookie: string;
  values: { groupId: string; addedBy: string; memberId: string };
}) {
  const { addedBy, groupId, memberId } = values;
  try {
    await fetch("http://localhost:8090/api/group_members/", {
      method: "POST",
      body: JSON.stringify({
        groupId,
        addedBy,
        memberId,
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
  } catch (e: any) {
    revalidatePath("/");
    throw new Error(e);
  }
}
