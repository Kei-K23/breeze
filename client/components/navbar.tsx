"use client";

import Image from "next/image";
import Link from "next/link";

import { Group, LogInIcon, Menu, Users } from "lucide-react";
import useScrollTop from "@/hook/use-scroll-top";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import { UserAvatar } from "./user-avatar";
import SocketIndicator from "./socket-indicator";
import { useSocket } from "@/provider/socket-provider";
import Notification from "./notification";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { UserType } from "@/app/(dashboard)/_components/RightSideBar";
import { Button, buttonVariants } from "./ui/button";
import { useSheet } from "@/provider/sheet-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface NavbarProp {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  currentUser?: UserType;
  iconLink: string;
  cookie?: string;
}

const Navbar = ({
  name,
  email,
  image,
  iconLink,
  currentUser,
  cookie,
}: NavbarProp) => {
  const isScrolled = useScrollTop();
  const { isConnected } = useSocket();
  const {
    setIsLeftSheetOpen,
    setIsRightSheetOpen,
    isRightSheetOpen,
    isLeftSheetOpen,
  } = useSheet();

  return (
    <header
      className={cn(
        " bg-neutral-100 dark:bg-slate-900 h-[10%] sm:h-[8%]  sticky top-0 w-full z-30 opacity-95",
        isScrolled && "border-b border-b-neutral-300 dark:border-b-slate-700"
      )}
    >
      <nav className="p-4  md:px-20 flex justify-between items-center">
        <Link
          href={iconLink}
          className="flex justify-between items-center gap-3 "
        >
          <span className="hidden lg:block [text-shadow:_0_1px_1px_rgb(138_207_235)] hover:underline font-bold text-lg">
            Breeze
          </span>
          <Image
            src={"/breezeIcon.png"}
            alt="breeze icon"
            width={30}
            height={30}
          />
        </Link>
        <div className="flex items-center gap-6 lg:gap-10">
          <SocketIndicator />
          {email && name ? (
            <>
              <div className="flex items-center justify-center relative">
                <UserAvatar
                  email={email}
                  name={name}
                  image={image as string}
                  cookie={cookie}
                />
                {isConnected ? (
                  <>
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full"></div>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={"/"}>
                      <LogInIcon />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Login</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
          {currentUser && (
            <Notification
              cookie={cookie}
              currentUser={currentUser as UserType}
            />
          )}

          <ModeToggle />

          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant={"outline"} className="block 2xl:hidden">
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                <DropdownMenuLabel className="text-center">
                  Menu
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    className="w-full flex items-center  gap-2 justify-start p-0"
                    variant={"ghost"}
                    onClick={() => {
                      isLeftSheetOpen
                        ? setIsLeftSheetOpen(false)
                        : setIsLeftSheetOpen(true);
                    }}
                  >
                    <Group /> <span>Groups</span>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    className="w-full flex items-center  gap-2 justify-start p-0"
                    variant={"ghost"}
                    onClick={() => {
                      isRightSheetOpen
                        ? setIsRightSheetOpen(false)
                        : setIsRightSheetOpen(true);
                    }}
                  >
                    <Users /> <span>Friends</span>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
