import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import { revalidatePath } from "next/cache";
import MainDashboard from "../_components/MainDashboard";

const Dashboard = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  // fetch user data
  const resUserData = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users?breeze_csrf=${searchParams.cookie}`,
    {
      method: "GET",
      headers: {
        Cookie: `breeze_csrf=${searchParams.cookie}`,
      },
      next: { revalidate: 0 },
    }
  );

  const userData = await resUserData.json();

  if (!resUserData.ok) {
    return redirect("/");
  }

  // fetch group data
  const resGroupDate = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/groups/${userData.data._id}?breeze_csrf=${searchParams.cookie}`,
    {
      method: "GET",
      headers: {
        Cookie: `breeze_csrf=${searchParams.cookie}`,
      },
      credentials: "include",
      next: { revalidate: 0 },
    }
  );
  const groupData = await resGroupDate.json();

  // fetch group data
  const resUsersDate = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users/${userData.data._id}?breeze_csrf=${searchParams.cookie}`,
    {
      method: "GET",
      headers: {
        Cookie: `breeze_csrf=${searchParams.cookie}`,
      },
      next: { revalidate: 0 },
    }
  );

  const usersData = await resUsersDate.json();

  const messagesRes = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/messages/${
      process.env.NEXT_PUBLIC_GLOBAL_CHAT_ROOM_ID
    }?limit=${15}&breeze_csrf=${searchParams.cookie}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        Cookie: `breeze_csrf=${searchParams.cookie}`,
      },
      cache: "no-cache",
    }
  );
  const fetchMessagesDataFromPage = await messagesRes.json();

  revalidatePath("/");

  return (
    <>
      <Navbar
        name={userData.data.name}
        email={userData.data.email}
        image={userData.data.picture}
        currentUser={userData.data}
        cookie={searchParams.cookie as string}
        iconLink="/dashboard"
      />
      <MainDashboard
        isCookieExist={searchParams.isCookieExist as string}
        groupData={groupData}
        cookie={searchParams.cookie as string}
        currentUser={userData.data}
        usersData={usersData}
        fetchMessagesDataFromPage={fetchMessagesDataFromPage.data}
      />
    </>
  );
};

export default Dashboard;
