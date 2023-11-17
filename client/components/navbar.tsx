"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { buttonVariants } from "@/components/ui/button";
import { Globe2Icon, LogInIcon } from "lucide-react";
import useScrollTop from "@/hook/use-scroll-top";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import { UserAvatar } from "./user-avatar";

interface NavbarProp {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  iconLink: string;
}

const Navbar = ({ name, email, image, iconLink }: NavbarProp) => {
  const isScrolled = useScrollTop();
  return (
    <header
      className={cn(
        " bg-neutral-100 dark:bg-slate-900 h-[10%] sm:h-[8%]  sticky top-0 w-full z-30",
        isScrolled && "border-b border-b-neutral-300 dark:border-b-neutral-700"
      )}
    >
      <nav className="py-4 px-8  md:px-20 flex justify-between items-center">
        <Link
          href={iconLink}
          className="flex justify-between items-center gap-3"
        >
          <span className="underline font-bold text-lg">Breeze</span>
        </Link>
        <div className="flex items-center gap-10">
          {email && name ? (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <UserAvatar
                      email={email}
                      name={name}
                      image={image as string}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Your Profile</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            <Link href={"/"}>
              <LogInIcon />
            </Link>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ModeToggle />
              </TooltipTrigger>
              <TooltipContent>Theme</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
