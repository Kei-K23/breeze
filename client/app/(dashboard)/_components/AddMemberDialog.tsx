"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { UserType } from "./RightSideBar";
import toast from "react-hot-toast";
import { createGroupMemberAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useSocket } from "@/provider/socket-provider";

interface AddMemberDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  cookie: string;
  existMember: UserType[];
  selectedChatGroup: string;
  currentUser: UserType;
}

export type NotificationType = {
  title: "Group invitation!" | "Friend request!";
  content:
    | "We want to invite you to our new group."
    | "I want to make friend with you";
  sourceIdToConfirm: string; /// confirmation id
  senderId: string;
  senderName: string;
  createdAt: Date;
  receiverId: string;
  checkUnique: string;
};

const AddMemberDialog = ({
  open,
  setOpen,
  existMember,
  cookie,
  selectedChatGroup,
  currentUser,
}: AddMemberDialogProps) => {
  const router = useRouter();
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [addableUsers, setAddableUsers] = useState<UserType[]>([]);

  const { socket } = useSocket();

  const userIdsArray = existMember.reduce((acc: Array<string>, curr) => {
    const id = curr._id;
    acc.push(id);
    return acc;
  }, []);

  useEffect(() => {
    if (selectedChatGroup !== process.env.NEXT_PUBLIC_GLOBAL_CHAT_ROOM_ID) {
      fetchData();
    }
  }, [existMember]);

  async function fetchData() {
    try {
      const res = await fetch("http://localhost:8090/api/users/without", {
        method: "POST",
        body: JSON.stringify({ userIdArray: userIdsArray }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        next: {
          revalidate: 0,
        },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setAddableUsers(data.data);
      } else {
        console.log(data);

        toast.error(data.error);
      }
    } catch (e: any) {
      console.log(e);

      toast.error(e.message);
    }
  }

  async function onSubmit() {
    try {
      selectedUsers.map(async (user) => {
        const groupMemberToInvite = await createGroupMemberAction({
          cookie,
          values: [
            {
              addedBy: currentUser._id,
              groupId: selectedChatGroup,
              memberId: user._id,
            },
          ],
        });
        const notification: NotificationType = {
          title: "Group invitation!",
          content: "We want to invite you to our new group.",
          createdAt: new Date(),
          senderId: currentUser._id,
          senderName: currentUser.name,
          sourceIdToConfirm: groupMemberToInvite[0]._id,
          receiverId: user._id,
          checkUnique: crypto.randomUUID().toString(),
        };
        socket.emit("send_notification", notification);
      });

      toast.success("Successfully add new member");
      setOpen(false);
      return;
    } catch (e: any) {
      toast.error(e.message);
      setOpen(false);
      return;
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-0 p-0 outline-none">
        <DialogHeader className="px-4 pb-4 pt-5">
          <DialogTitle>Create new Group</DialogTitle>
          <DialogDescription>
            Create your group and organize, invite, share and communicate.
          </DialogDescription>
        </DialogHeader>

        <Command className="overflow-hidden rounded-t-none border-t">
          {/* <CommandInput placeholder="Search user..." /> */}
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup className="p-2">
              {addableUsers &&
                addableUsers.map((user) => (
                  <CommandItem
                    key={user?._id}
                    className="flex items-center px-2 cursor-pointer"
                    onSelect={() => {
                      if (selectedUsers.includes(user)) {
                        return setSelectedUsers(
                          selectedUsers.filter(
                            (selectedUser) => selectedUser !== user
                          )
                        );
                      }

                      return setSelectedUsers(
                        [...addableUsers].filter((u) =>
                          [...selectedUsers, user].includes(u)
                        )
                      );
                    }}
                  >
                    <Avatar>
                      <AvatarImage src={user?.picture} alt="Image" />
                      <AvatarFallback>{user?.name}</AvatarFallback>
                    </Avatar>
                    <div className="ml-2">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    {selectedUsers.includes(user as UserType) ? (
                      <Check className="ml-auto flex h-5 w-5 text-primary" />
                    ) : null}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="flex items-center border-t p-4 sm:justify-between">
          {selectedUsers.length > 0 ? (
            <div className="flex -space-x-2 overflow-hidden">
              {selectedUsers.map((user) => (
                <Avatar
                  key={user.email}
                  className="inline-block border-2 border-background"
                >
                  <AvatarImage src={user.picture} />
                  <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select users to add to this group or add users later.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              onSubmit();
              router.refresh();
            }}
          >
            <Plus width={15} height={15} /> <span className="ml-1">Add</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
