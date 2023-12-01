"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogOut from "@/lib/logOut";
import { UserCircle2 } from "lucide-react";
interface UserAvatarProp {
  name: string;
  email: string;
  image: string;
  cookie?: string;
}

export function UserAvatar({ cookie, email, image, name }: UserAvatarProp) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8  w-8 rounded-full">
          <Avatar className="h-11 w-11 lg:h-12 lg:w-12">
            {image ? (
              <>
                <AvatarImage src={image} alt={name} />
                <AvatarFallback>{name}</AvatarFallback>
              </>
            ) : (
              <UserCircle2 className={`w-10 h-10 rounded-ful`} />
            )}
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
        <DropdownMenuItem className="p-0">
          <LogOut cookie={cookie} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
