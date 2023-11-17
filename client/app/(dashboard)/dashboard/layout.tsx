import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: `Dashboard`,
  description: "This is dashboard and workspace for user",
};

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const res = await fetch(`${process.env.BACKEND_URL}/api/users`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();
  console.log(data);

  if (!data.success) {
    return redirect("/");
  }

  return (
    <main>
      <Navbar
        name={"my name"}
        email={"my email"}
        image={"my image"}
        iconLink="/dashboard"
      />
      {children}
    </main>
  );
};

export default DashboardLayout;
