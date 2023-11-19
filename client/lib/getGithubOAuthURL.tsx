import { buttonVariants } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

const GetGithubOAuthURL = () => {
  const rootURL = "https://github.com/login/oauth/authorize";

  const options = {
    redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URL as string,
    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string,
    scope: "user:email",
  };

  const queryString = new URLSearchParams(options);
  const { resolvedTheme } = useTheme();

  return (
    <Link
      href={`${rootURL}?${queryString.toString()}`}
      className={buttonVariants({
        variant: "default",
      })}
    >
      <Image
        src={`${
          resolvedTheme === "dark" ? "/github_light.png" : "/github_dark.png"
        }`}
        alt="github icon"
        width={35}
        height={35}
      />{" "}
      <span className="ml-3 font-bold">Login with Github</span>
    </Link>
  );
};

export default GetGithubOAuthURL;
