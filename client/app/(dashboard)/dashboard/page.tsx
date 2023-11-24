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
  const resUserData = await fetch("http://localhost:8090/api/users", {
    method: "GET",
    headers: {
      Cookie: `breeze_csrf=${searchParams.cookie}`,
    },
    next: { revalidate: 0 },
  });

  const userData = await resUserData.json();

  if (!resUserData.ok) {
    return redirect("/");
  }

  // fetch group data
  const resGroupDate = await fetch(
    `http://localhost:8090/api/groups/${userData.data._id}`,
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
    `http://localhost:8090/api/users/${userData.data._id}`,
    {
      method: "GET",
      headers: {
        Cookie: `breeze_csrf=${searchParams.cookie}`,
      },
      next: { revalidate: 0 },
    }
  );

  const usersData = await resUsersDate.json();

  revalidatePath("/");

  return (
    <>
      <Navbar
        name={userData.data.name}
        email={userData.data.email}
        image={userData.data.picture}
        currentUser={userData.data}
        iconLink="/dashboard"
      />
      <MainDashboard
        groupData={groupData}
        cookie={searchParams.cookie as string}
        currentUser={userData.data}
        usersData={usersData}
      />
    </>
  );
};

export default Dashboard;
