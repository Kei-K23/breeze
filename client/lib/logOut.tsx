import { buttonVariants } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";

const LogOut = () => {
  return (
    <Link
      href={"http://localhost:8090/api/auth/logout"}
      className={buttonVariants({
        variant: "destructive",
        className: "w-full",
      })}
    >
      <LogOutIcon className="mr-5 " /> Logout
    </Link>
  );
};

export default LogOut;
