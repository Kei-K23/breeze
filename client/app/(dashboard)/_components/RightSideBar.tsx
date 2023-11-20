import { ScrollArea } from "@/components/ui/scroll-area";
import { Group } from "lucide-react";
import React from "react";

type FetchDataType = {
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
interface RightSideBarProps {
  usersData: Partial<FetchDataType>;
}
const RightSideBar = ({ usersData }: RightSideBarProps) => {
  return (
    <div className="h-[800px] w-[15%] ">
      <div className="py-2">
        <h2 className="relative px-7 text-lg font-semibold tracking-tight flex items-center gap-2">
          <Group /> <span>Users</span>
        </h2>
        <ScrollArea className="h-[600px]   px-1">
          <div className="space-y-1 p-2">
            {usersData.data &&
              usersData.data.map((user) => (
                <div
                  className="cursor-pointer py-2 px-4 border dark:border-slate-700 border-neutral-300 rounded-md hover:shadow-md hover:shadow-neutral-300 dark:hover:shadow-slate-700"
                  key={user?._id}
                >
                  <h3>{user?.name}</h3>
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
