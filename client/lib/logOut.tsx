import { deleteRefreshTokenCookie } from "@/app/actions";
import { buttonVariants } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";

interface LogOutProps {
  cookie?: string;
}

const LogOut = ({ cookie }: LogOutProps) => {
  return (
    <Link
      href={`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/auth/logout?breeze_csrf=${cookie}`}
      className={buttonVariants({
        variant: "destructive",
        className: "w-full",
      })}
      onClick={async () => await deleteRefreshTokenCookie("breeze_csrf")}
    >
      <LogOutIcon className="mr-5 " /> Logout
    </Link>
  );
};

export default LogOut;
