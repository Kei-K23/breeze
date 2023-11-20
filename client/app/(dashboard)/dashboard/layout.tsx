import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Dashboard`,
  description: "This is dashboard and workspace for user",
};

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return <main className="h-full">{children}</main>;
};

export default DashboardLayout;
