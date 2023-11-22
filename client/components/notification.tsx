import React, { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { Bell } from "lucide-react";
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

interface NotificationProps {
  currentUser: UserType;
}

const Notification = ({ currentUser }: NotificationProps) => {
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
            setNotifications((prev) => [
              ...prev,
              ...(nArray as NotificationType[]),
            ]);
          }
        }
      };

      socket.on("receive_notification", receiveNotification);

      return () => {
        // Clean up the event listener when the component unmounts
        socket.off("receive_notification", receiveNotification);
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"outline"} className="p-2 relative">
                <Bell />
                {notifications.length > 0 && (
                  <Badge className="absolute -top-3 -right-3">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
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
        {notifications && notifications.length ? (
          notifications.map((n) => (
            <DropdownMenuItem key={n.checkUnique} className="flex">
              <div className="flex flex-col justify-start gap-2">
                <div className="flex justify-between items-center">
                  <h3>{n.title}</h3>
                  <h3>from: {n.senderName}</h3>
                </div>
                <p>{n.content}</p>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem>No notification yet!</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
