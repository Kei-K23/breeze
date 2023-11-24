"use client";
import React, { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { Bell, Group, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { useSocket } from "@/provider/socket-provider";
import { NotificationType } from "@/app/(dashboard)/_components/AddMemberDialog";
import toast from "react-hot-toast";
import { UserType } from "@/app/(dashboard)/_components/RightSideBar";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
import { ScrollArea } from "./ui/scroll-area";

interface NotificationProps {
  currentUser: UserType;
}

const Notification = ({ currentUser }: NotificationProps) => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationType[]>([
    ...(currentUser.notification as NotificationType[]),
  ]);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      const receiveNotification = async (notification: NotificationType) => {
        if (currentUser._id === notification.receiverId) {
          const isExistingN = notifications.some(
            (n) => n.checkUnique === notification.checkUnique
          );

          if (!isExistingN) {
            const nArray = await fetchEditUserData({
              userId: notification.receiverId,
              payload: [notification],
            });

            setNotifications([...(nArray as NotificationType[])]);
            toast("New notification has received");
          }
        }
      };

      socket.on(
        "response_notification_accept",
        (data: { name: string; senderId: string; receiverId: string }) => {
          if (data.receiverId === currentUser._id) {
            toast(`${data.name} is accepted your invitation`);
          }
        }
      );

      socket.on(
        "response_notification_decline",
        (data: {
          name: string;
          senderId: string;
          receiverId: string;
          message?: string;
        }) => {
          if (data.receiverId === currentUser._id) {
            if (data.message) {
              toast(data.message);
              router.refresh();
            } else {
              toast(`Sorry! ${data.name} is reject your invitation`);
            }
          }
        }
      );

      socket.on("receive_notification", receiveNotification);

      return () => {
        // Clean up the event listener when the component unmounts
        socket.off("receive_notification", receiveNotification);
        socket.off(
          "response_notification_accept",
          (data: { name: string; senderId: string; receiverId: string }) => {
            if (data.receiverId === currentUser._id) {
              toast(`${data.name} is accepted your invitation`);
            }
          }
        );
        socket.off(
          "response_notification_decline",
          (data: { name: string; senderId: string; receiverId: string }) => {
            if (data.receiverId === currentUser._id) {
              toast(`Sorry! ${data.name} is reject your invitation`);
            }
          }
        );
      };
    }
  }, [currentUser, notifications, socket]);

  async function fetchEditUserData({
    userId,
    payload,
  }: {
    userId: string;
    payload: NotificationType[];
  }) {
    try {
      const resEditedUser = await fetch(
        `http://localhost:8090/api/users/${userId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            notification: payload,
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          cache: "no-cache",
          next: {
            revalidate: 0,
          },
        }
      );

      const editedUserData = await resEditedUser.json();

      return editedUserData.data.notification as NotificationType[];
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function onClickAcceptForGroup({
    groupMemberId,
    payload,
    notificationSenderId,
  }: {
    groupMemberId: string;
    notificationSenderId: string;
    payload: NotificationType;
  }) {
    try {
      await fetch(`http://localhost:8090/api/groups/${groupMemberId}`, {
        method: "PUT",
        body: JSON.stringify({
          status: "Accept",
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
      toast("Cong! You have new group");
      onClickRemoveNOfUser({
        userId: currentUser._id,
        payload,
      });

      socket.emit("response_notification_accept", {
        name: currentUser.name,
        senderId: currentUser._id,
        receiverId: notificationSenderId,
        groupId: payload.groupId,
      });
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function onClickRemoveNOfUser({
    userId,
    payload,
    notificationSenderId,
    _id,
  }: {
    userId: string;
    notificationSenderId?: string;
    payload: NotificationType;
    _id?: string;
  }) {
    try {
      await fetch(`http://localhost:8090/api/users/rmN/${userId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        next: {
          revalidate: 0,
        },
      });

      if (_id) {
        await fetch(`http://localhost:8090/api/groups_members/`, {
          method: "DELETE",
          body: JSON.stringify({ _id }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          next: {
            revalidate: 0,
          },
        });

        socket.emit("response_notification_decline", {
          name: currentUser.name,
          senderId: currentUser._id,
          receiverId: notificationSenderId,
        });
      }

      setNotifications((prev) => {
        return prev.filter((p) => p._id !== payload._id);
      });
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Bell />
                {notifications.length > 0 && (
                  <Badge
                    className="px-2 absolute -top-3.5 -right-3.5"
                    variant={"destructive"}
                  >
                    {notifications.length}
                  </Badge>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>Notification </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-[400px]">
        <DropdownMenuLabel>
          Notification {notifications.length}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[500px] max-w-[400px]">
          {notifications && notifications.length ? (
            notifications.map((n) => (
              <DropdownMenuItem
                key={n.checkUnique}
                className="flex py-2 px-3 border-b dark:border-slate-700 border-neutral-300  last:border-b-0 cursor-pointer"
              >
                <div className="flex flex-col justify-start gap-2 w-full">
                  <div className="flex justify-between items-center w-full">
                    <div>
                      {n.title === "Group Deleted!" && (
                        <h3 className="text-base font-bold flex">
                          <Trash /> {n.title}
                        </h3>
                      )}
                      {n.title === "Group invitation!" && (
                        <h3 className="text-base font-bold flex">
                          <Group /> {n.title}
                        </h3>
                      )}
                      {n.groupName && (
                        <h3 className="text-base">Group name: {n.groupName}</h3>
                      )}
                    </div>
                    <div>
                      <h3>from: {n.senderName}</h3>
                      <h3>
                        {new Date(n.createdAt).toLocaleDateString("en-US")}
                      </h3>
                    </div>
                  </div>
                  <p>{n.content}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {n.title === "Group invitation!" && (
                      <>
                        <Button
                          size={"sm"}
                          onClick={async () => {
                            await onClickAcceptForGroup({
                              groupMemberId: n.sourceIdToConfirm as string,
                              payload: n,
                              notificationSenderId: n.senderId,
                            });
                            router.refresh();
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          size={"sm"}
                          variant={"destructive"}
                          onClick={async () => {
                            await onClickRemoveNOfUser({
                              userId: currentUser._id,
                              payload: n,
                              notificationSenderId: n.senderId,
                              _id: n.sourceIdToConfirm,
                            });
                            router.refresh();
                          }}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    {n.title === "Group Deleted!" && (
                      <Button
                        size={"sm"}
                        variant={"destructive"}
                        onClick={async () => {
                          await onClickRemoveNOfUser({
                            userId: currentUser._id,
                            payload: n,
                            notificationSenderId: n.senderId,
                          });
                          router.refresh();
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem>No notification yet!</DropdownMenuItem>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
