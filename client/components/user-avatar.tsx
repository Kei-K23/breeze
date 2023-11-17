"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe2Icon, LayoutDashboardIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface UserAvatarProp {
  name: string;
  email: string;
  image: string;
}

export function UserAvatar({ email, image, name }: UserAvatarProp) {
  const path = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8  w-8 rounded-full">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={image === "no_image" ? "/user.png" : image}
              alt={name}
            />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-lg font-medium leading-none mb-2">{name}</p>
            <p className="text-md leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0 my-2">
          {path === "/dashboard" ? (
            <Link
              href={"/community"}
              className={`${buttonVariants({ variant: "secondary" })} w-full`}
            >
              <Globe2Icon className="text-sky-500 mr-2 " />
              Explore the Community
            </Link>
          ) : (
            <Link
              href={"/dashboard"}
              className={`${buttonVariants({ variant: "secondary" })} w-full`}
            >
              <LayoutDashboardIcon className="text-orange-500 mr-2 " />
              Go to Dashboard
            </Link>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <Button variant={"destructive"} className="w-full h-full">
            Logout <LogOutIcon className="ml-4 h-5" />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
