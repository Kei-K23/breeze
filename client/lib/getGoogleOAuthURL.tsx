import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";

import Link from "next/link";

const GetGoogleOAuthURL = () => {
  const rootURL = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL as string,
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const queryString = new URLSearchParams(options);

  return (
    <Link
      href={`${rootURL}?${queryString.toString()}`}
      className={buttonVariants({ variant: "default" })}
    >
      <Image src={"/google.png"} alt="github icon" width={30} height={30} />{" "}
      <span className="ml-3 font-bold">Login with Google</span>
    </Link>
  );
};

export default GetGoogleOAuthURL;
