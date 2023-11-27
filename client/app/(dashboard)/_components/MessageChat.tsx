"use client";

import { Plus, Send, Trash, UserCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { UserType } from "./RightSideBar";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import AddMemberDialog, { NotificationType } from "./AddMemberDialog";
import { useSocket } from "@/provider/socket-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { IMessage } from "./MainDashboard";
import { isUUID } from "@/lib/helper";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageChatProps {
  selectedChatGroup: string;
  cookie: string;
  usersData: UserType[];
  currentUser: UserType;
  fetchMessages: IMessage[];
  setFetchMessages: (fetchMessages: IMessage[]) => void;
  setSelectedChatGroup: (selectedChatGroup: string) => void;
}

type DeleteGroupParaType = {
  _id: string;
  ownerId: string[];
  groupId: string;
  groupMembers: UserType[];
  groupName: string;
};

export function MessageChat({
  selectedChatGroup,
  setSelectedChatGroup,
  cookie,
  currentUser,
  fetchMessages,
  usersData,
  setFetchMessages,
}: MessageChatProps) {
  const [group, setGroup] = useState<{
    _id: string;
    groupName: string;
    groupDescription: string;
    ownerId: string[];
    createdAt: Date;
    updatedAt: Date;
    groupUserNames?: Array<{
      name: string;
      id: string;
    }>;
    customUniqueGroupId?: string;
  }>();
  const [groupMembers, setGroupMembers] = useState<Array<UserType>>([]);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [deleteGroupOpen, setDeleteGroupOpen] = useState(false);
  const [input, setInput] = useState("");
  const [deleteGroupState, setDeleteGroupState] =
    useState<DeleteGroupParaType | null>(null);
  const [typingName, setTypingName] = useState("");

  const router = useRouter();
  const { socket } = useSocket();
  const formRef = useRef<HTMLDivElement | null>(null);

  const inputLength = input.trim().length;

  const userIdsArray = usersData
    ? usersData.reduce((acc: Array<string>, curr) => {
        const id = curr._id;
        acc.push(id);
        return acc;
      }, [])
    : [];

  useEffect(() => {
    if (!isUUID(selectedChatGroup)) {
      fetchChatGroupData({
        groupId: selectedChatGroup,
      });
    }
    if (socket) {
      socket.on(
        "response_notification_accept_group",
        async (notification: NotificationType) => {
          if (notification.receiverId === currentUser._id) {
            fetchChatGroupData({
              groupId: notification.groupId as string,
            });
          }
        }
      );
      socket.on(
        "response_notification_delete_group",
        async (notification: NotificationType) => {
          if (notification.receiverId === currentUser._id) {
            setSelectedChatGroup("");
            router.refresh();
          }
        }
      );

      let timeOutForFormRef: any;
      let timeOutForClearTyping: any;

      socket.on("message", (message: IMessage[]) => {
        setFetchMessages(message);
        clearInterval(timeOutForFormRef);
        timeOutForFormRef = setTimeout(() => {
          if (formRef.current) {
            formRef.current.scrollTop = formRef.current.scrollHeight + 100000;
          }
        }, 100);
      });

      socket.on(
        "typing_message",
        ({ roomId, name }: { roomId: string; name: string }) => {
          if (roomId === selectedChatGroup) {
            setTypingName(name);
            if (timeOutForClearTyping) {
              clearInterval(timeOutForClearTyping);
            }
            timeOutForClearTyping = setTimeout(() => {
              setTypingName("");
            }, 1000);
          }
        }
      );

      return () => {
        socket.off("response_notification_accept_group");
        socket.off("response_notification_delete_group");
        socket.off("message");
        socket.off("typing");
      };
    }
  }, [selectedChatGroup]);

  // fetch chat group data
  async function fetchChatGroupData({ groupId }: { groupId: string }) {
    try {
      const resGroup = await fetch(
        `http://localhost:8090/api/groups?groupId=${groupId}`,
        {
          method: "GET",
          credentials: "include",
          next: {
            revalidate: 0,
          },
        }
      );

      const groupData = await resGroup.json();

      if (resGroup.ok && groupData.success) {
        setGroup(groupData.data);
        if (!selectedChatGroup) return;
        const resGroupMembers = await fetch(
          `http://localhost:8090/api/groups?groupIdForMembers=${selectedChatGroup}`,
          {
            method: "GET",
            credentials: "include",
            next: {
              revalidate: 0,
              tags: ["group_member"],
            },
            cache: "no-cache",
          }
        );
        const groupMembersData = await resGroupMembers.json();

        if (resGroupMembers.ok && groupMembersData.success) {
          setGroupMembers(groupMembersData.data);
        } else {
          toast.error(groupMembersData.error);
        }
      } else {
        toast.error(groupData.error);
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function onClickDeleteGroup({
    _id,
    groupId,
    groupMembers,
    ownerId,
    groupName,
  }: DeleteGroupParaType) {
    try {
      await fetch(`http://localhost:8090/api/groups/`, {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({
          _id,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        next: {
          revalidate: 0,
        },
        cache: "no-cache",
      });

      if (groupMembers.length) {
        groupMembers.map(async (groupMember) => {
          await fetch(`http://localhost:8090/api/groups_members/`, {
            method: "DELETE",
            body: JSON.stringify({
              groupId,
              memberId: groupMember._id,
            }),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            credentials: "include",
            next: {
              revalidate: 0,
            },
          });
          const notification: NotificationType = {
            title: "Group Deleted!",
            content: "Sorry! The group is deleted.",
            createdAt: new Date(),
            senderId: currentUser._id,
            senderName: currentUser.name,
            receiverId: groupMember._id,
            checkUnique: crypto.randomUUID().toString(),
            groupName,
            groupId,
          };
          await fetch("http://localhost:8090/api/messages/", {
            method: "DELETE",
            body: JSON.stringify({
              groupId,
            }),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            credentials: "include",
            next: {
              revalidate: 0,
            },
          });
          socket.emit("send_notification", notification);
        });
      }
      setDeleteGroupState(null);
      setSelectedChatGroup("");
      toast.success("Successfully deleted the group!");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
      return;
    }
  }

  async function onSubmitCreateMessages({
    payload,
    event,
  }: {
    payload: IMessage;
    event: FormEvent<HTMLFormElement>;
  }) {
    event.preventDefault();
    if (inputLength === 0) return;

    try {
      const newMessageRes = await fetch("http://localhost:8090/api/messages/", {
        method: "POST",
        body: JSON.stringify(payload),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        next: { revalidate: 0 },
        cache: "no-cache",
      });

      const newMessageData = await newMessageRes.json();
      if (newMessageRes.ok && newMessageData.success) {
        setFetchMessages([...fetchMessages, payload]);
        setInput("");
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.scrollTop = formRef.current.scrollHeight + 100000;
          }
        }, 100);
        socket.emit("chat_message", {
          roomId: selectedChatGroup,
          message: [...fetchMessages, payload],
        });
        setTypingName("");
      } else {
        toast.error(newMessageData.error);
      }
    } catch (e: any) {
      console.log(e);
      toast.error("Could not send message!");
    }
  }

  return (
    <>
      <Card className="h-full w-full flex-1 rounded-none relative">
        <CardHeader className="flex flex-row items-center pb-1  lg:pb-2">
          <div className="flex items-center justify-between w-full space-x-4">
            <div className="flex items-center gap-4">
              <div>
                {selectedChatGroup && group?.customUniqueGroupId ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      {currentUser.friends.some(
                        (f) =>
                          f.customUniqueGroupId === group.customUniqueGroupId
                      ) ? (
                        currentUser.friends.map((f) => {
                          if (
                            group.groupUserNames?.some(
                              (user) => user.id === f.friendId
                            )
                          ) {
                            return (
                              <Image
                                key={f.friendId}
                                src={f.picture as string}
                                alt={f.name as string}
                                width={48}
                                height={48}
                                className="rounded-full"
                              />
                            );
                          }
                        })
                      ) : (
                        <UserCircle2 className={cn("w-10 h-10 ")} />
                      )}
                      <p className="text-sm font-medium leading-none mb-2">
                        {
                          group?.groupUserNames?.filter(
                            (user) => user.id !== currentUser._id
                          )[0].name
                        }
                      </p>
                    </div>
                  </>
                ) : selectedChatGroup && group ? (
                  <>
                    <p className="text-sm font-medium leading-none mb-2">
                      {group?.groupName}
                    </p>
                    {group?.groupDescription ? (
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="text-sm text-muted-foreground line-clamp-1 w-[90px]">
                              {group.groupDescription}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            {" "}
                            {group.groupDescription}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <p className="text-sm text-muted-foreground">---</p>
                    )}
                  </>
                ) : (
                  <div className="flex">
                    <div>
                      <Skeleton className="h-11 w-11 lg:h-12 lg:w-12 rounded-full" />
                    </div>
                    <Skeleton className="h-2 lg:h-3  w-[40px] lg:w-[50px]" />
                  </div>
                )}
                {typingName ? (
                  <p className="text-sm text-muted-foreground italic">
                    {typingName} is typing...
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">...</p>
                )}
              </div>
              {selectedChatGroup !=
                process.env.NEXT_PUBLIC_GLOBAL_CHAT_ROOM_ID &&
                selectedChatGroup &&
                !group?.customUniqueGroupId &&
                group?.ownerId.some((id) => id === currentUser._id) && (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="ml-auto rounded-full"
                          onClick={() => setAddMemberOpen(true)}
                        >
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">Add new member</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add new member</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              {selectedChatGroup !=
                process.env.NEXT_PUBLIC_GLOBAL_CHAT_ROOM_ID &&
                selectedChatGroup &&
                !group?.customUniqueGroupId &&
                group?.ownerId.some((id) => id === currentUser._id) && (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Trash
                          className="text-red-500 cursor-pointer"
                          onClick={() => {
                            if (
                              group?.ownerId.some(
                                (id) => id === currentUser._id
                              )
                            )
                              setDeleteGroupState({
                                _id: group._id,
                                ownerId: group.ownerId,
                                groupMembers,
                                groupId: group._id,
                                groupName: group.groupName,
                              });
                            setDeleteGroupOpen(true);
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>Delete the group</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
            </div>
            {selectedChatGroup &&
              !group?.customUniqueGroupId &&
              (groupMembers && groupMembers.length > 0 ? (
                <div className="relative">
                  {groupMembers && groupMembers.length > 0 && (
                    <Badge className="absolute -top-3 -right-3 z-10 cursor-pointer">
                      {groupMembers.length}
                    </Badge>
                  )}
                  <ScrollArea className="w-32 lg:w-52 rounded-md border ">
                    <div className="flex w-max items-center gap-3 cursor-pointer m-2">
                      {groupMembers && groupMembers.length > 0 ? (
                        groupMembers.map((member) => (
                          <div key={member._id}>
                            <TooltipProvider delayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  {member?.picture ? (
                                    <Image
                                      src={member?.picture as string}
                                      alt={member?.name as string}
                                      width={35}
                                      height={35}
                                      className={`rounded-full  ${
                                        group?.ownerId[0] === member._id &&
                                        "ring-2 ring-sky-500"
                                      } `}
                                    />
                                  ) : (
                                    <UserCircle2
                                      className={`w-9 h-9 rounded-full  ${
                                        group?.ownerId.some(
                                          (id) => id === member._id
                                        ) && "ring-2 ring-sky-500"
                                      } `}
                                    />
                                  )}
                                </TooltipTrigger>
                                <TooltipContent>{member.name}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        ))
                      ) : (
                        <h1>No member</h1>
                      )}
                    </div>
                    <ScrollBar
                      className="h-2 cursor-grabbing "
                      orientation="horizontal"
                    />
                  </ScrollArea>
                </div>
              ) : (
                <div>
                  <Skeleton className="h-10 w-[200px]" />
                </div>
              ))}
          </div>
        </CardHeader>
        <div className="h-[1px] w-full  dark:bg-slate-700 bg-neutral-300"></div>
        <CardContent>
          {selectedChatGroup ? (
            <div
              ref={formRef}
              className="space-y-4 overflow-auto  h-[400px]  lg:h-[550px] xl:h-[640px] no-scrollbar"
            >
              {fetchMessages && fetchMessages.length > 0 ? (
                fetchMessages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                      message.senderId === currentUser._id
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {usersData.map((user) => {
                      if (user._id === message.senderId) {
                        return (
                          <div
                            key={user._id}
                            className="flex items-center gap-2"
                          >
                            <Avatar className="h-6 w-6 lg:h-7 lg:w-7">
                              {user.picture ? (
                                <>
                                  <AvatarImage
                                    src={user.picture}
                                    alt={user.name}
                                  />
                                  <AvatarFallback>{user.name}</AvatarFallback>
                                </>
                              ) : (
                                <UserCircle2 className="h-6 w-6 lg:h-7 lg:w-7" />
                              )}
                            </Avatar>
                            <h3>{user.name}</h3>
                          </div>
                        );
                      }
                    })}
                    {currentUser._id === message.senderId && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 lg:h-7 lg:w-7">
                          {currentUser.picture ? (
                            <>
                              <AvatarImage
                                src={currentUser.picture}
                                alt={currentUser.name}
                              />
                              <AvatarFallback>
                                {currentUser.name}
                              </AvatarFallback>
                            </>
                          ) : (
                            <UserCircle2 className="h-6 w-6 lg:h-7 lg:w-7" />
                          )}
                        </Avatar>
                        <h3>You</h3>
                      </div>
                    )}
                    {message.textMessage}
                  </div>
                ))
              ) : (
                <div className="overflow-auto no-scrollbar text-slate-500 flex justify-center items-center flex-col h-[400px]  lg:h-[550px] xl:h-[640px]">
                  <h2>No message yet in this group!</h2>
                  <h2>Be first person that send the message!</h2>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row justify-center items-center space-y-4 overflow-auto h-[400px]  lg:h-[550px] xl:h-[640px] no-scrollbar">
              <Image
                src={"/chatImg.png"}
                alt="chat image"
                width={200}
                height={200}
              />
              <h2 className="lg:ml-4 text-slate-500">
                Start communicate by clicking Groups or Your friends
              </h2>
            </div>
          )}
        </CardContent>
        {selectedChatGroup && (
          <CardFooter className="absolute w-full p-0 ">
            <form
              onSubmit={(event) => {
                onSubmitCreateMessages({
                  payload: {
                    groupId: selectedChatGroup,
                    receiverId: [...userIdsArray],
                    textMessage: input,
                    senderId: currentUser._id,
                  },
                  event,
                });
              }}
              className="flex w-full items-center space-x-2"
            >
              <Input
                id="message"
                placeholder="Type your message..."
                className="flex-1"
                autoComplete="off"
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  socket.emit("typing_message", {
                    roomId: selectedChatGroup,
                    name: currentUser.name,
                  });
                }}
              />
              <Button type="submit" size="icon" disabled={inputLength === 0}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        )}
      </Card>
      <Dialog open={deleteGroupOpen} onOpenChange={setDeleteGroupOpen}>
        <DialogContent className="gap-0 p-0 outline-none">
          <DialogHeader className="px-4 pb-4 pt-5">
            <DialogTitle className="text-red-500 font-semibold text-xl">
              Delete the group?
            </DialogTitle>
            <DialogDescription>This is delete forever!</DialogDescription>
          </DialogHeader>

          <div className="flex items-center border-t p-4 justify-between">
            <Button
              variant={"destructive"}
              onClick={() => {
                if (deleteGroupState) onClickDeleteGroup(deleteGroupState);
                setDeleteGroupOpen(false);
                router.refresh();
              }}
            >
              Delete
            </Button>
            <Button
              onClick={() => {
                setDeleteGroupOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {group?.ownerId.some((id) => id === currentUser._id) && (
        <AddMemberDialog
          currentUser={currentUser}
          selectedChatGroup={selectedChatGroup}
          existMember={groupMembers}
          setAddMemberOpen={setAddMemberOpen}
          addMemberOpen={addMemberOpen}
          cookie={cookie}
        />
      )}
    </>
  );
}
