import Navbar from "@/components/navbar";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type JWTDecodedType = {
  userId: string;
  is_valid: boolean;
  token_id: string;
  email: string;
  picture: string;
  iat: number;
  exp: number;
};

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
        ) as JWTDecodedType;

        if (decoded) {
          try {
            const resSession = await fetch(
              `http://localhost:8090/api/session/${decoded.token_id}`,
              {
                method: "GET",
              }
            );

            const sessionData = await resSession.json();

            if (resSession.ok && sessionData.success) {
              return redirect("/dashboard");
            } else {
              return (
                <div className="h-full">
                  <Navbar iconLink="/" />
                  <main>{children}</main>
                </div>
              );
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
