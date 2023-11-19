import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const GetGithubOAuthURL = () => {
  const rootURL = "https://github.com/login/oauth/authorize";

  const options = {
    redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URL as string,
    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string,
    scope: "user:email",
  };

  const queryString = new URLSearchParams(options);

  return (
    <Link
      href={`${rootURL}?${queryString.toString()}`}
      className={buttonVariants({ variant: "default" })}
    >
      Login with Github
    </Link>
  );
};

export default GetGithubOAuthURL;
