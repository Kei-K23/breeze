import { deleteRefreshTokenCookie } from "@/app/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface LogOutProps {
  cookie?: string;
}

const LogOut = ({ cookie }: LogOutProps) => {
  const router = useRouter();
  return (
    <Button
      className={buttonVariants({
        variant: "destructive",
        className: "w-full",
      })}
      onClick={async () => {
        await deleteRefreshTokenCookie("breeze_csrf");
        router.push("/");
      }}
    >
      <LogOutIcon className="mr-5 " /> Logout
    </Button>
  );
};

export default LogOut;
