import Navbar from "@/components/navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const LandingPageLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const refreshCookie = cookies().get("breeze_csrf");

  if (refreshCookie?.name === "breeze_csrf") {
    if (refreshCookie.value) return redirect("/dashboard");
  }

  return (
    <div className="h-full">
      <Navbar iconLink="/" />
      <main>{children}</main>
    </div>
  );
};

export default LandingPageLayout;
