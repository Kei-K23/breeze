"use server";

import { revalidatePath } from "next/cache";
import { UserType } from "./(dashboard)/_components/RightSideBar";

export async function createGroupAction({
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

    await createGroupMemberAction({
      cookie,
      values: [
        {
          addedBy: currentUserId,
          memberId: currentUserId,
          groupId: groupData.data._id,
        },
      ],
    });

    if (selectedUsers.length) {
      selectedUsers.map(async (user) => {
        await createGroupMemberAction({
          cookie,
          values: [
            {
              addedBy: currentUserId,
              memberId: user._id,
              groupId: groupData.data._id,
            },
          ],
        });
      });
    }
    revalidatePath("/");
  } catch (e: any) {
    revalidatePath("/");
    throw new Error(e.message);
  }
}

export async function createGroupMemberAction({
  values,
  cookie,
}: {
  cookie: string;
  values: { groupId: string; addedBy: string; memberId: string }[];
}) {
  try {
    await fetch("http://localhost:8090/api/group_members/", {
      method: "POST",
      body: JSON.stringify({
        groupMembers: values,
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
    revalidatePath("/");
    throw new Error(e);
  }
}
