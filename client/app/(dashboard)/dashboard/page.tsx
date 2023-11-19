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
  const res = await fetch("http://localhost:8090/api/users", {
    method: "GET",
    headers: {
      Cookie: `breeze_csrf=${searchParams.cookie}`,
    },
    next: { revalidate: 0 },
  });

  const data = await res.json();

  if (!res.ok) {
    return redirect("/");
  }

  return (
    <>
      <Navbar
        name={data.data.name}
        email={data.data.email}
        image={data.data.picture}
        iconLink="/dashboard"
      />
      <div className="h-full flex items-center">
        <LeftSideBar />
        <MessageChat />
        <RightSideBar />
      </div>
    </>
  );
};

export default Dashboard;
