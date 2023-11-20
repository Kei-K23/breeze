import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import { MessageChat } from "../_components/Chat";
import LeftSideBar from "../_components/LeftSideBar";
import RightSideBar from "../_components/RightSideBar";

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
      next: { revalidate: 0 },
    }
  );

  const groupData = await resGroupDate.json();

  return (
    <>
      <Navbar
        name={userData.data.name}
        email={userData.data.email}
        image={userData.data.picture}
        iconLink="/dashboard"
      />
      <div className="h-full flex items-center ">
        <LeftSideBar groupData={groupData} />
        <MessageChat />
        <RightSideBar />
      </div>
    </>
  );
};

export default Dashboard;
