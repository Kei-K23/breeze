import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";

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
      <div className="my-12  pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-7 px-4 md:px-10 lg:px-16  "></div>
    </>
  );
};

export default Dashboard;
