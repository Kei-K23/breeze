"use client";

import Image from "next/image";
import Link from "next/link";

import { Group, LogInIcon, Users } from "lucide-react";
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
import { Button } from "./ui/button";
import { useSheet } from "@/provider/sheet-provider";

interface NavbarProp {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  currentUser?: UserType;
  iconLink: string;
}

const Navbar = ({ name, email, image, iconLink, currentUser }: NavbarProp) => {
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
      <nav className="py-4 px-8  md:px-20 flex justify-between items-center">
        <Link
          href={iconLink}
          className="flex justify-between items-center gap-3 "
        >
          <span className="hidden 2xl:block [text-shadow:_0_1px_1px_rgb(138_207_235)] hover:underline font-bold text-lg">
            Breeze
          </span>
          <Image
            src={"/breezeIcon.png"}
            alt="breeze icon"
            width={30}
            height={30}
          />
        </Link>
        <div className="flex items-center gap-10">
          <SocketIndicator />

          {email && name ? (
            <>
              <div className="flex items-center justify-center relative">
                <UserAvatar email={email} name={name} image={image as string} />
                {isConnected ? (
                  <>
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full"></div>
                        </TooltipTrigger>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                ) : (
                  <>
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        </TooltipTrigger>
                      </Tooltip>
                    </TooltipProvider>
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
            <Notification currentUser={currentUser as UserType} />
          )}

          <ModeToggle />

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    isLeftSheetOpen
                      ? setIsLeftSheetOpen(false)
                      : setIsLeftSheetOpen(true);
                  }}
                >
                  <Group />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Groups</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    isRightSheetOpen
                      ? setIsRightSheetOpen(false)
                      : setIsRightSheetOpen(true);
                  }}
                >
                  <Users />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Friends</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
