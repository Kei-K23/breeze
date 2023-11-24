"use client";
import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserType } from "./RightSideBar";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { createGroupAction, createGroupMemberAction } from "@/app/actions";
import { NotificationType } from "./AddMemberDialog";
import { useSocket } from "@/provider/socket-provider";

interface CreateGroupDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  users: UserType[];
  setSelectedUsers: (users: UserType[]) => void;
  selectedUsers: UserType[];
  currentUser: UserType;
  cookie: string;
}

const formSchema = z.object({
  groupName: z
    .string({
      required_error: "Group name is required",
    })
    .min(3, "Group name must be at least 3 character long"),
  groupDescription: z.string({}).optional(),
});

const CreateGroupDialog = ({
  open,
  selectedUsers,
  setOpen,
  setSelectedUsers,
  users,
  currentUser,
  cookie,
}: CreateGroupDialogProps) => {
  const { socket } = useSocket();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: "",
      groupDescription: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const group = await createGroupAction({
        values,
        currentUserId: currentUser._id,
        cookie,
        selectedUsers,
      });

      if (selectedUsers.length) {
        selectedUsers.map(async (user) => {
          const groupMember = await createGroupMemberAction({
            cookie,
            values: [
              {
                addedBy: currentUser._id,
                memberId: user._id,
                groupId: group._id,
                status: "Pending",
              },
            ],
          });
          selectedUsers.map((selectedUser) => {
            const notification: NotificationType = {
              title: "Group invitation!",
              content: "We want to invite you to our new group.",
              createdAt: new Date(),
              senderId: currentUser._id,
              senderName: currentUser.name,
              sourceIdToConfirm: groupMember[0]._id,
              receiverId: selectedUser._id,
              checkUnique: crypto.randomUUID().toString(),
              groupId: group._id,
            };
            socket.emit("send_notification", notification);
          });
        });
      }

      toast.success("Successfully created new Group");
      setOpen(false);
      return;
    } catch (e: any) {
      toast.error("Could not create new group");
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
              {users &&
                users.map((user) => (
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
                        [...users].filter((u) =>
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
                  key={user._id}
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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 px-4 pb-4"
          >
            <FormField
              control={form.control}
              name="groupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group name:</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g My Awesome Group" {...field} />
                  </FormControl>
                  <FormDescription>This is your group name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="groupDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g My group description..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your group description.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">
              <Plus width={15} height={15} />{" "}
              <span className="ml-1">Create</span>
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
