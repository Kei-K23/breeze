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

import {
  Bell,
  Check,
  Group,
  Trash,
  User,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
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
            if (notification.title === "Group invitation!") {
              toast("Receive new group invitation for you!");
            } else {
              toast("Sorry! Group you joined is deleted.");
            }
            router.refresh();
          }
        }
      };

      socket.on(
        "response_notification_accept",
        async (notification: NotificationType) => {
          if (notification.receiverId === currentUser._id) {
            const isExistingN = notifications.some(
              (n) => n.checkUnique === notification.checkUnique
            );

            if (!isExistingN) {
              const nArray = await fetchEditUserData({
                userId: notification.receiverId,
                payload: [notification],
              });

              setNotifications([...(nArray as NotificationType[])]);
              toast(
                `${notification.senderName} is accepted your group invitation`
              );
              router.refresh();
            }
          }
        }
      );

      socket.on(
        "response_notification_decline",
        async (notification: NotificationType) => {
          if (notification.receiverId === currentUser._id) {
            const isExistingN = notifications.some(
              (n) => n.checkUnique === notification.checkUnique
            );

            if (!isExistingN) {
              const nArray = await fetchEditUserData({
                userId: notification.receiverId,
                payload: [notification],
              });
              setNotifications([...(nArray as NotificationType[])]);
              toast(
                `Sorry! ${notification.senderName} is reject your invitation`
              );
              router.refresh();
            }
          }
        }
      );

      socket.on("receive_notification", receiveNotification);

      // socket for add friend request
      socket.on("add_friend", async (data: NotificationType) => {
        if (currentUser._id === data.receiverId) {
          const isExistingN = notifications.some(
            (n) => n.checkUnique === data.checkUnique
          );

          if (!isExistingN) {
            const nArray = await fetchEditUserData({
              userId: data.receiverId,
              payload: [data],
            });

            setNotifications([...(nArray as NotificationType[])]);
            toast(`${data.senderName} is want to friend with you`);
            router.refresh();
          }
        }
      });

      socket.on("accept_friend", async (data: NotificationType) => {
        if (currentUser._id === data.receiverId) {
          const isExistingN = notifications.some(
            (n) => n.checkUnique === data.checkUnique
          );

          if (!isExistingN) {
            const nArray = await fetchEditUserData({
              userId: data.receiverId,
              payload: [data],
            });

            setNotifications([...(nArray as NotificationType[])]);
            toast(`${data.senderName} is accepted to friend with you`);
            router.refresh();
          }
        }
      });

      socket.on("decline_friend", async (data: NotificationType) => {
        if (currentUser._id === data.receiverId) {
          const isExistingN = notifications.some(
            (n) => n.checkUnique === data.checkUnique
          );

          if (!isExistingN) {
            const nArray = await fetchEditUserData({
              userId: data.receiverId,
              payload: [data],
            });

            setNotifications([...(nArray as NotificationType[])]);

            toast(`${data.senderName} is decline your friend request`);
            router.refresh();
          }
        }
      });

      return () => {
        // Clean up the event listener when the component unmounts
        socket.off("receive_notification", receiveNotification);
        socket.off("response_notification_accept");
        socket.off("response_notification_decline");
        socket.off("add_friend");
        socket.off("decline_friend");
        socket.off("accept_friend");
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
      toast("Congrats! You have new group");
      onClickRemoveNOfUser({
        userId: currentUser._id,
        payload,
      });

      const notification: NotificationType = {
        title: "Accept group invitation!",
        content: "Congrats! Group invitation accepted.",
        createdAt: new Date(),
        checkUnique: crypto.randomUUID().toString(),
        receiverId: notificationSenderId,
        senderId: currentUser._id,
        senderName: currentUser.name,
        groupId: payload.groupId,
      };

      socket.emit("response_notification_accept", notification);
      router.refresh();
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

        const notification: NotificationType = {
          title: "Decline group invitation!",
          content: "Sorry! I would like to decline your group invitation.",
          createdAt: new Date(),
          checkUnique: crypto.randomUUID().toString(),
          receiverId: notificationSenderId as string,
          senderId: currentUser._id,
          senderName: currentUser.name,
          groupId: payload.groupId,
        };
        socket.emit("response_notification_decline", notification);
      }

      setNotifications((prev) => {
        return prev.filter((p) => p._id !== payload._id);
      });
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function onClickAcceptFriendRequest({
    friendId,
    senderName,
    senderId,
    payload,
  }: {
    senderName: string;
    friendId: string;
    senderId: string;
    senderEmail?: string;
    senderPicture?: string;
    payload: NotificationType;
  }) {
    const uniqueId = crypto.randomUUID().toString();
    try {
      const resGroupData = await fetch("http://localhost:8090/api/groups/", {
        method: "POST",
        body: JSON.stringify({
          groupName: `${currentUser.name}-${senderName}`,
          ownerId: [senderId, payload.receiverId],
          customUniqueGroupId: uniqueId,
          groupUserNames: [
            { name: currentUser.name, id: currentUser._id },
            { name: senderName, id: senderId },
          ],
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

      const groupData = await resGroupData.json();

      if (resGroupData.ok && groupData.success) {
        const resAcceptFriend = await fetch(
          `http://localhost:8090/api/users/accept-friends/${senderId}`,
          {
            method: "PUT",
            body: JSON.stringify({
              friendId: friendId,
              status: "Friended",
              customUniqueGroupId: uniqueId,
              groupId: groupData.data._id,
            }),
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            next: {
              revalidate: 0,
            },
            cache: "no-cache",
          }
        );
        const acceptFriendData = await resAcceptFriend.json();

        if (resAcceptFriend.ok && acceptFriendData.success) {
          await fetch(
            `http://localhost:8090/api/users/accept-friends/${payload.receiverId}`,
            {
              method: "PUT",
              body: JSON.stringify({
                friendId: senderId,
                status: "Friended",
                customUniqueGroupId: uniqueId,
                groupId: groupData.data._id,
              }),
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              next: {
                revalidate: 0,
              },
              cache: "no-cache",
            }
          );

          await fetch(
            `http://localhost:8090/api/users/rmN/${currentUser._id}`,
            {
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
            }
          );
          setNotifications((prev) => {
            return prev.filter((p) => p._id !== payload._id);
          });

          toast(`You are now friend with ${senderName}`);

          const notification: NotificationType = {
            title: "Accept friend request!",
            content: "Congrats! Friend request accepted.",
            createdAt: new Date(),
            checkUnique: crypto.randomUUID().toString(),
            receiverId: payload.senderId,
            senderId: currentUser._id,
            senderName: currentUser.name,
          };

          socket.emit("accept_friend", notification);
        } else {
          toast.error(acceptFriendData.error);
        }
      } else {
        toast.error(groupData.error);
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function onClickRemoveFriendRequest({
    payload,
    friendId,
    senderId,
    senderName,
  }: {
    payload: NotificationType;
    friendId: string;
    senderName: string;
    senderId: string;
  }) {
    try {
      await fetch(`http://localhost:8090/api/users/rmN/${currentUser._id}`, {
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

      await fetch(
        `http://localhost:8090/api/users/decline-friends/${senderId}`,
        {
          method: "DELETE",
          body: JSON.stringify({ friendId }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          next: {
            revalidate: 0,
          },
        }
      );
      await fetch(
        `http://localhost:8090/api/users/decline-friends/${currentUser._id}`,
        {
          method: "DELETE",
          body: JSON.stringify({ friendId: senderId }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          next: {
            revalidate: 0,
          },
        }
      );
      setNotifications((prev) => {
        return prev.filter((p) => p._id !== payload._id);
      });

      const notification: NotificationType = {
        title: "Decline friend request!",
        content: "Sorry! I would like to decline your friend request.",
        createdAt: new Date(),
        checkUnique: crypto.randomUUID().toString(),
        receiverId: payload.senderId,
        senderId: currentUser._id,
        senderName: currentUser.name,
      };

      socket.emit("decline_friend", notification);
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function removeNotification({
    userId,
    payload,
  }: {
    userId: string;
    payload: NotificationType;
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
      <DropdownMenuContent className="w-[300px] md:max-w-[450px]">
        <DropdownMenuLabel>
          Notification {notifications.length}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px] lg:h-[500px]  w-[300px]  md:max-w-[450px]">
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
                        <h3 className="text-base font-bold flex  text-red-500">
                          <Trash /> {n.title}
                        </h3>
                      )}
                      {n.title === "Group invitation!" && (
                        <h3 className="text-base font-bold flex">
                          <Group /> {n.title}
                        </h3>
                      )}
                      {n.title === "Friend request!" && (
                        <h3 className="text-base font-bold flex">
                          <User /> {n.title}
                        </h3>
                      )}
                      {n.title === "Accept group invitation!" && (
                        <h3 className="text-base font-bold flex text-green-500">
                          <Check /> {n.title}
                        </h3>
                      )}
                      {n.title === "Accept friend request!" && (
                        <h3 className="text-base font-bold flex text-green-500">
                          <UserCheck /> {n.title}
                        </h3>
                      )}
                      {n.title === "Decline friend request!" && (
                        <h3 className="text-base font-bold flex text-red-500">
                          <UserX /> {n.title}
                        </h3>
                      )}
                      {n.title === "Decline group invitation!" && (
                        <h3 className="text-base font-bold flex text-red-500">
                          <X /> {n.title}
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
                    {n.title === "Friend request!" && (
                      <>
                        <Button
                          size={"sm"}
                          onClick={async () => {
                            await onClickAcceptFriendRequest({
                              friendId: n.receiverId,
                              senderName: n.senderName,
                              senderId: n.senderId,
                              senderEmail: n.senderEmail,
                              senderPicture: n.senderPicture,
                              payload: n,
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
                            await onClickRemoveFriendRequest({
                              friendId: n.receiverId,
                              payload: n,
                              senderId: n.senderId,
                              senderName: n.senderName,
                            });
                            router.refresh();
                          }}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    {n.title === "Accept group invitation!" && (
                      <Button
                        size={"sm"}
                        variant={"destructive"}
                        onClick={async () => {
                          await removeNotification({
                            userId: currentUser._id,
                            payload: n,
                          });
                          router.refresh();
                        }}
                      >
                        Clear
                      </Button>
                    )}
                    {n.title === "Decline group invitation!" && (
                      <Button
                        size={"sm"}
                        variant={"destructive"}
                        onClick={async () => {
                          await removeNotification({
                            userId: currentUser._id,
                            payload: n,
                          });
                          router.refresh();
                        }}
                      >
                        Clear
                      </Button>
                    )}
                    {n.title === "Accept friend request!" && (
                      <Button
                        size={"sm"}
                        variant={"destructive"}
                        onClick={async () => {
                          await removeNotification({
                            userId: currentUser._id,
                            payload: n,
                          });
                          router.refresh();
                        }}
                      >
                        Clear
                      </Button>
                    )}
                    {n.title === "Decline friend request!" && (
                      <Button
                        size={"sm"}
                        variant={"destructive"}
                        onClick={async () => {
                          await removeNotification({
                            userId: currentUser._id,
                            payload: n,
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
