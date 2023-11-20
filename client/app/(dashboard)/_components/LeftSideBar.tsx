"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Group, Plus } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

import { FetchUsersDataType, UserType } from "./RightSideBar";
import CreateGroupDialog from "./CreateGroupDialog";

type FetchGroupsDataType = {
  success: true;
  data: Array<{
    _id: string;
    groupName: string;
    ownerId: string;
    groupDescription: string;
  }>;
  error: string;
};

interface LeftSideBarProps {
  groupData: Partial<FetchGroupsDataType>;
  usersData: Partial<FetchUsersDataType>;
  currentUser: UserType;
}

const LeftSideBar = ({
  groupData,
  usersData,
  currentUser,
}: LeftSideBarProps) => {
  const [open, setOpen] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState<UserType[]>([]);

  if (!groupData.success) {
    toast.error(groupData.error as string);
  }

  return (
    <div className="h-[800px] w-[15%] ">
      <div className="py-2">
        <h2 className="relative px-7 text-lg font-semibold tracking-tight flex items-center gap-2">
          <Group /> <span>Groups</span>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="ml-auto rounded-full"
                  onClick={() => setOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Create new Group</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={10}>Create new Group</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h2>
        <ScrollArea className="h-[600px]   px-1">
          <div className="space-y-1 p-2">
            {groupData.data &&
              groupData.data.map((group) => (
                <div
                  className="cursor-pointer py-2 px-4 border dark:border-slate-700 border-neutral-300 rounded-md hover:shadow-md hover:shadow-neutral-300 dark:hover:shadow-slate-700"
                  key={group._id}
                >
                  <h3>{group.groupName}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 line-clamp-1">
                    {group.groupDescription}
                  </p>
                </div>
              ))}
          </div>
        </ScrollArea>
      </div>
      <CreateGroupDialog
        setOpen={setOpen}
        open={open}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        users={usersData.data as UserType[]}
        currentUser={currentUser}
      />
    </div>
  );
};

export default LeftSideBar;
