import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { User2Icon, UserCircle2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";

export type FetchUsersDataType = {
  success: true;
  data: Partial<
    Array<{
      _id: string;
      name: string;
      providerName: string;
      __v: number;
      createdAt: Date;
      email: string;
      picture: string;
      updatedAt: Date;
    }>
  >;
  error: string;
};

export type UserType = {
  _id: string;
  name: string;
  providerName: string;
  __v: number;
  createdAt: Date;
  email: string;
  picture: string;
  updatedAt: Date;
};
interface RightSideBarProps {
  usersData: Partial<FetchUsersDataType>;
}
const RightSideBar = ({ usersData }: RightSideBarProps) => {
  if (!usersData.success) {
    toast.error(usersData.error as string);
  }

  return (
    <div className="h-[800px] w-[15%] ">
      <div className="py-2">
        <h2 className="relative px-7 text-lg font-semibold tracking-tight flex items-center gap-2">
          <User2Icon /> <span>Users</span>
        </h2>
        <ScrollArea className="h-[700px] px-1">
          <div className=" p-2">
            {usersData.data &&
              usersData.data.map((user) => (
                <div
                  className="my-3 cursor-pointer py-2 px-4 border dark:border-slate-700 border-neutral-300 rounded-md hover:shadow-md hover:shadow-neutral-300 dark:hover:shadow-slate-700"
                  key={user?._id}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {user?.picture ? (
                      <Image
                        src={user?.picture as string}
                        alt={user?.name as string}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <UserCircle2 className={cn("w-10 h-10 ")} />
                    )}

                    <h3>{user?.name}</h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 line-clamp-1">
                    {user?.email}
                  </p>
                </div>
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default RightSideBar;
