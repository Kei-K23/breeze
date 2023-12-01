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
      const decoded = verify(
        refreshCookie?.value as string,
        process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET as string
      ) as JWTDecodedType;

      if (decoded) {
        const resSession = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/session/${decoded.token_id}?breeze_csrf=${refreshCookie.value}`,
          {
            method: "GET",
            headers: {
              Cookie: `breeze_csrf=${refreshCookie.value}`,
            },
            next: {
              revalidate: 0,
            },
            credentials: "include",
          }
        );

        if (resSession.ok) {
          return redirect("/dashboard");
        } else {
          return (
            <div className="h-full">
              <Navbar iconLink="/" />
              <main>{children}</main>
            </div>
          );
        }
      } else {
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
