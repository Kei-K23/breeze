import Navbar from "@/components/navbar";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const LandingPageLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const refreshCookie = cookies().get("breeze_csrf");

  if (refreshCookie?.name === "breeze_csrf") {
    if (refreshCookie.value) {
      try {
        const decoded = verify(
          refreshCookie?.value as string,
          process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET as string
        );

        if (decoded) {
          return redirect("/dashboard");
        }
      } catch (e: any) {
        return (
          <div className="h-full">
            <Navbar iconLink="/" />
            <main>{children}</main>
          </div>
        );
      }
    }
  }

  return (
    <div className="h-full">
      <Navbar iconLink="/" />
      <main>{children}</main>
    </div>
  );
};

export default LandingPageLayout;
