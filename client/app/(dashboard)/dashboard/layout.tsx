import type { Metadata } from "next";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: `Dashboard`,
  description: "This is dashboard and workspace for user",
};

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
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
