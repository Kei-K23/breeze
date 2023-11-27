"use client";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";
import { useSocket } from "@/provider/socket-provider";
import {
  Hourglass,
  User,
  User2Icon,
  UserCircle2,
  UserPlus2,
  Users,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { NotificationType } from "./AddMemberDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { useSheet } from "@/provider/sheet-provider";

export type FriendDataType = {
  friendId: string;
  status: "Pending" | "Friended";
  email: string;
  picture: string;
  name: string;
  customUniqueGroupId?: string;
  groupId?: string;
};

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
      notification: NotificationType[];
      friends: FriendDataType[];
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
  notification: NotificationType[];
  friends: FriendDataType[];
};
interface RightSideBarProps {
  usersData: Partial<FetchUsersDataType>;
  currentUser: UserType;
  selectedChatGroup: string;
  setSelectedChatGroup: (selectedChatGroup: string) => void;
}
const RightSideBar = ({
  selectedChatGroup,
  usersData,
  setSelectedChatGroup,
  currentUser,
}: RightSideBarProps) => {
  const [onlineUser, setOnlineUser] = useState<
    Array<{ id: string; roomId: string }>
  >([]);
  const { socket } = useSocket();
  const router = useRouter();
  const { isRightSheetOpen, setIsRightSheetOpen } = useSheet();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(
      "system_active_users",
      (
        users: Array<{
          id: string;
          roomId: string;
        }>
      ) => {
        setOnlineUser(users);
      }
    );

    socket.on("add_friend", (data: NotificationType) => {
      if (currentUser._id === data.receiverId) {
        router.refresh();
      }
    });

    return () => {
      socket.off("system_active_users");
      socket.off("add_friend");
      socket.emit("leave_room", { roomId: selectedChatGroup });
    };
  }, [socket]);

  async function onClickRequestAddFriend({
    email,
    friendId,
    name,
    picture,
    status,
  }: Partial<FriendDataType>) {
    try {
      const resAddFriend = await fetch(
        `http://localhost:8090/api/users/add-friends/${currentUser._id}`,
        {
          method: "POST",
          body: JSON.stringify({
            friendIds: [{ email, friendId, name, picture, status }],
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

      await fetch(`http://localhost:8090/api/users/add-friends/${friendId}`, {
        method: "POST",
        body: JSON.stringify({
          friendIds: [
            {
              email: currentUser.email,
              friendId: currentUser._id,
              name: currentUser.name,
              picture: currentUser.picture,
              status: "Pending",
            },
          ],
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
      });
      const addFriendData = await resAddFriend.json();
      if (resAddFriend.ok && addFriendData.success) {
        // add friend request notification message data

        const addFriRequestNotification: NotificationType = {
          title: "Friend request!",
          content: "I want to make friend with you.",
          createdAt: new Date(),
          senderId: currentUser._id,
          senderName: currentUser.name,
          receiverId: friendId as string,
          senderEmail: currentUser.email,
          senderPicture: currentUser.picture,
          checkUnique: crypto.randomUUID().toString(),
        };

        socket.emit("add_friend", addFriRequestNotification);
        router.refresh();
      } else {
        toast.error(addFriendData.error);
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  return (
    <div className="h-[800px] w-[15%] hidden 2xl:block">
      <div className="py-2">
        <h2 className="relative px-7 text-lg font-semibold tracking-tight flex items-center gap-2">
          <Users /> <span>Friends</span>
        </h2>
        <ScrollArea className="max-h-[350px] px-1">
          <div className=" p-2 grid grid-cols-2 gap-2">
            {currentUser && currentUser.friends.length > 0 ? (
              currentUser.friends.map((user) => {
                if (user.status === "Friended") {
                  return (
                    <TooltipProvider key={user?.friendId} delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="my-3 cursor-pointer py-2 px-4 border dark:border-slate-700 border-neutral-300 rounded-md hover:shadow-md hover:shadow-neutral-300 dark:hover:shadow-slate-700"
                            onClick={() => {
                              setSelectedChatGroup(user.groupId as string);
                              socket.emit("join_room", {
                                roomId: user.groupId,
                                name: currentUser.name,
                              });
                            }}
                          >
                            <div className="flex flex-col items-center gap-1 mb-2">
                              <div className="relative">
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
                                {onlineUser.length &&
                                onlineUser.some(
                                  (online) =>
                                    online.id === (user?.friendId as string)
                                ) ? (
                                  <div
                                    className={cn(
                                      "absolute -top-0 -right-0 w-3 h-3  rounded-full bg-green-500"
                                    )}
                                  ></div>
                                ) : (
                                  <div
                                    className={cn(
                                      "absolute -top-0 -right-0 w-3 h-3  rounded-full bg-red-500"
                                    )}
                                  ></div>
                                )}
                              </div>
                              <h3 className="line-clamp-1">{user?.name}</h3>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{user?.name}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                } else if (user.status === "Pending") {
                  <h2 className="text-center">No friends yet!</h2>;
                } else {
                  <h2 className="text-center">No friends yet!</h2>;
                }
              })
            ) : (
              <div>
                <h2 className="text-center">No friends yet!</h2>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="py-2">
        <h2 className="relative px-7 text-lg font-semibold tracking-tight flex items-center gap-2 mb-2">
          <User2Icon /> <span>Users</span>
        </h2>
        <ScrollArea className="h-[350px] px-1 max-w-[300px]">
          <div className="p-2 max-w-[300px]">
            {usersData.data ? (
              usersData.data &&
              usersData.data.map((user) => (
                <div
                  className="my-3 cursor-pointer py-2 pl-4 border dark:border-slate-700 border-neutral-300 rounded-md hover:shadow-md hover:shadow-neutral-300 dark:hover:shadow-slate-700"
                  key={user?._id}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative">
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
                      {onlineUser.length &&
                      onlineUser.some(
                        (online) => online.id === (user?._id as string)
                      ) ? (
                        <div
                          className={cn(
                            "absolute -top-0 -right-0 w-3 h-3  rounded-full bg-green-500"
                          )}
                        ></div>
                      ) : (
                        <div
                          className={cn(
                            "absolute -top-0 -right-0 w-3 h-3  rounded-full bg-red-500"
                          )}
                        ></div>
                      )}
                    </div>

                    <h3>{user?.name}</h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 line-clamp-1">
                    {user?.email}
                  </p>
                  <div className="mt-2">
                    {/* {currentUser && currentUser.friends.length > 0 ? (
                      currentUser.friends.map((friend) => {
                        if (
                          friend.friendId === user?._id &&
                          friend.status === "Friended"
                        ) {
                          return (
                            <Button
                              disabled
                              key={friend.friendId}
                              className="flex gap-1 bg-green-500 cursor-wait"
                            >
                              <User /> Friend
                            </Button>
                          );
                        }

                        if (
                          friend.friendId !== user?._id &&
                          friend.status !== "Friended"
                        ) {
                          return (
                            <Button
                              key={friend.friendId}
                              size={"sm"}
                              className="flex gap-1 bg-sky-500"
                              onClick={() => {
                                onClickRequestAddFriend({
                                  email: user?.email,
                                  friendId: user?._id,
                                  name: user?.name,
                                  picture: user?.picture,
                                  status: "Pending",
                                });
                                router.refresh();
                              }}
                            >
                              {" "}
                              <UserPlus2 /> Add Friend
                            </Button>
                          );
                        }
                        if (
                          friend.friendId !== user?._id &&
                          friend.status === "Pending"
                        ) {
                          return (
                            <Button
                              disabled
                              key={friend.friendId}
                              className="flex gap-1 bg-yellow-500 cursor-wait"
                            >
                              <Hourglass /> Waiting....
                            </Button>
                          );
                        }
                      })
                    ) : (
                      <Button
                        size={"sm"}
                        className="flex gap-1 bg-sky-500"
                        onClick={() => {
                          onClickRequestAddFriend({
                            email: user?.email,
                            friendId: user?._id,
                            name: user?.name,
                            picture: user?.picture,
                            status: "Pending",
                          });
                          router.refresh();
                        }}
                      >
                        {" "}
                        <UserPlus2 /> Add Friend
                      </Button>
                    )} */}
                    {/* {currentUser && currentUser.friends.length > 0 ? (
                      currentUser.friends.map((friend) => {
                        if (friend.friendId === user?._id) {
                          if (friend.status === "Friended") {
                            return (
                              <Button
                                disabled
                                key={friend.friendId}
                                className="flex gap-1 bg-green-500 cursor-wait"
                              >
                                <User /> Friend
                              </Button>
                            );
                          } else if (friend.status === "Pending") {
                            return (
                              <Button
                                disabled
                                key={friend.friendId}
                                className="flex gap-1 bg-yellow-500 cursor-wait"
                              >
                                <Hourglass /> Waiting....
                              </Button>
                            );
                          }
                        } else {
                          return (
                            <Button
                              key={friend.friendId}
                              size={"sm"}
                              className="flex gap-1 bg-sky-500"
                              onClick={() => {
                                onClickRequestAddFriend({
                                  email: user?.email,
                                  friendId: user?._id,
                                  name: user?.name,
                                  picture: user?.picture,
                                  status: "Pending",
                                });
                                router.refresh();
                              }}
                            >
                              <UserPlus2 /> Add Friend
                            </Button>
                          );
                        }
                      })
                    ) : (
                      <Button
                        size={"sm"}
                        className="flex gap-1 bg-sky-500"
                        onClick={() => {
                          onClickRequestAddFriend({
                            email: user?.email,
                            friendId: user?._id,
                            name: user?.name,
                            picture: user?.picture,
                            status: "Pending",
                          });
                          router.refresh();
                        }}
                      >
                        {" "}
                        <UserPlus2 /> Add Friend
                      </Button>
                    )} */}

                    {currentUser && currentUser.friends.length > 0
                      ? currentUser.friends.map((friend) => {
                          if (friend.friendId === user?._id) {
                            if (friend.status === "Friended") {
                              return (
                                <Button
                                  disabled
                                  key={friend.friendId}
                                  className="flex gap-1 bg-green-500 cursor-wait"
                                >
                                  <User /> Friend
                                </Button>
                              );
                            } else if (friend.status === "Pending") {
                              return (
                                <Button
                                  disabled
                                  key={friend.friendId}
                                  className="flex gap-1 bg-yellow-500 cursor-wait"
                                >
                                  <Hourglass /> Waiting....
                                </Button>
                              );
                            } else {
                              return null; // To avoid unexpected rendering if none of the conditions are met
                            }
                          }
                          // If the friendId doesn't match, continue the loop
                          return null;
                        })
                      : null}

                    {/* Add Friend button outside the mapping */}
                    {!currentUser ||
                      (currentUser.friends.every(
                        (friend) => friend.friendId !== user?._id
                      ) && (
                        <Button
                          size={"sm"}
                          className="flex gap-1 bg-sky-500"
                          onClick={() => {
                            onClickRequestAddFriend({
                              email: user?.email,
                              friendId: user?._id,
                              name: user?.name,
                              picture: user?.picture,
                              status: "Pending",
                            });
                            router.refresh();
                          }}
                        >
                          <UserPlus2 /> Add Friend
                        </Button>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <div>
                <h2 className="text-center">No user yet!</h2>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <Sheet open={isRightSheetOpen} onOpenChange={setIsRightSheetOpen}>
        <SheetContent side={"right"} className="w-[250px] p-0 pt-14">
          <SheetHeader>
            <h2 className="relative px-7 text-lg font-semibold tracking-tight flex items-center gap-2">
              <Users /> <span className="hidden 2xl:block">Friends</span>
            </h2>
          </SheetHeader>
          <ScrollArea className="max-h-[350px] px-1">
            <div className=" p-2 grid grid-cols-2 gap-2">
              {currentUser && currentUser.friends.length > 0 ? (
                currentUser.friends.map((user) => {
                  if (user.status === "Friended") {
                    return (
                      <TooltipProvider key={user?.friendId} delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="my-3 cursor-pointer py-2 px-4 border dark:border-slate-700 border-neutral-300 rounded-md hover:shadow-md hover:shadow-neutral-300 dark:hover:shadow-slate-700"
                              onClick={() => {
                                setSelectedChatGroup(user.groupId as string);
                                socket.emit("join_room", {
                                  roomId: user.groupId,
                                  name: currentUser.name,
                                });
                              }}
                            >
                              <div className="flex flex-col items-center gap-1 mb-2">
                                <div className="relative">
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
                                  {onlineUser.length &&
                                  onlineUser.some(
                                    (online) =>
                                      online.id === (user?.friendId as string)
                                  ) ? (
                                    <div
                                      className={cn(
                                        "absolute -top-0 -right-0 w-3 h-3  rounded-full bg-green-500"
                                      )}
                                    ></div>
                                  ) : (
                                    <div
                                      className={cn(
                                        "absolute -top-0 -right-0 w-3 h-3  rounded-full bg-red-500"
                                      )}
                                    ></div>
                                  )}
                                </div>
                                <h3 className="line-clamp-1">{user?.name}</h3>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>{user?.name}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  } else if (user.status === "Pending") {
                    <h2 className="text-center">No friends yet!</h2>;
                  } else {
                    <h2 className="text-center">No friends yet!</h2>;
                  }
                })
              ) : (
                <div>
                  <h2 className="text-center">No friends yet!</h2>
                </div>
              )}
            </div>
          </ScrollArea>
          <SheetHeader>
            <h2 className="relative px-7 text-lg font-semibold tracking-tight flex items-center gap-2">
              <User2Icon /> <span className="hidden 2xl:block">Users</span>
            </h2>
            <ScrollArea className="h-[350px] px-1 ">
              <div className=" p-2 ">
                {usersData.data ? (
                  usersData.data &&
                  usersData.data.map((user) => (
                    <div
                      className=" my-3 cursor-pointer py-2 px-4 border dark:border-slate-700 border-neutral-300 rounded-md hover:shadow-md hover:shadow-neutral-300 dark:hover:shadow-slate-700"
                      key={user?._id}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="relative">
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
                          {onlineUser.length &&
                          onlineUser.some(
                            (online) => online.id === (user?._id as string)
                          ) ? (
                            <div
                              className={cn(
                                "absolute -top-0 -right-0 w-3 h-3  rounded-full bg-green-500"
                              )}
                            ></div>
                          ) : (
                            <div
                              className={cn(
                                "absolute -top-0 -right-0 w-3 h-3  rounded-full bg-red-500"
                              )}
                            ></div>
                          )}
                        </div>

                        <h3>{user?.name}</h3>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400 line-clamp-1">
                        {user?.email}
                      </p>
                      <div className="mt-2">
                        {/* {currentUser && currentUser.friends.length > 0 ? (
                      currentUser.friends.map((friend) => {
                        if (
                          friend.friendId === user?._id &&
                          friend.status === "Friended"
                        ) {
                          return (
                            <Button
                              disabled
                              key={friend.friendId}
                              className="flex gap-1 bg-green-500 cursor-wait"
                            >
                              <User /> Friend
                            </Button>
                          );
                        }

                        if (
                          friend.friendId !== user?._id &&
                          friend.status !== "Friended"
                        ) {
                          return (
                            <Button
                              key={friend.friendId}
                              size={"sm"}
                              className="flex gap-1 bg-sky-500"
                              onClick={() => {
                                onClickRequestAddFriend({
                                  email: user?.email,
                                  friendId: user?._id,
                                  name: user?.name,
                                  picture: user?.picture,
                                  status: "Pending",
                                });
                                router.refresh();
                              }}
                            >
                              {" "}
                              <UserPlus2 /> Add Friend
                            </Button>
                          );
                        }
                        if (
                          friend.friendId !== user?._id &&
                          friend.status === "Pending"
                        ) {
                          return (
                            <Button
                              disabled
                              key={friend.friendId}
                              className="flex gap-1 bg-yellow-500 cursor-wait"
                            >
                              <Hourglass /> Waiting....
                            </Button>
                          );
                        }
                      })
                    ) : (
                      <Button
                        size={"sm"}
                        className="flex gap-1 bg-sky-500"
                        onClick={() => {
                          onClickRequestAddFriend({
                            email: user?.email,
                            friendId: user?._id,
                            name: user?.name,
                            picture: user?.picture,
                            status: "Pending",
                          });
                          router.refresh();
                        }}
                      >
                        {" "}
                        <UserPlus2 /> Add Friend
                      </Button>
                    )} */}
                        {currentUser && currentUser.friends.length > 0
                          ? currentUser.friends.map((friend) => {
                              if (friend.friendId === user?._id) {
                                if (friend.status === "Friended") {
                                  return (
                                    <Button
                                      disabled
                                      key={friend.friendId}
                                      className="flex gap-1 bg-green-500 cursor-wait"
                                    >
                                      <User /> Friend
                                    </Button>
                                  );
                                } else if (friend.status === "Pending") {
                                  return (
                                    <Button
                                      disabled
                                      key={friend.friendId}
                                      className="flex gap-1 bg-yellow-500 cursor-wait"
                                    >
                                      <Hourglass /> Waiting....
                                    </Button>
                                  );
                                } else {
                                  return null; // To avoid unexpected rendering if none of the conditions are met
                                }
                              }
                              // If the friendId doesn't match, continue the loop
                              return null;
                            })
                          : null}

                        {/* Add Friend button outside the mapping */}
                        {!currentUser ||
                          (currentUser.friends.every(
                            (friend) => friend.friendId !== user?._id
                          ) && (
                            <Button
                              size={"sm"}
                              className="flex gap-1 bg-sky-500"
                              onClick={() => {
                                onClickRequestAddFriend({
                                  email: user?.email,
                                  friendId: user?._id,
                                  name: user?.name,
                                  picture: user?.picture,
                                  status: "Pending",
                                });
                                router.refresh();
                              }}
                            >
                              <UserPlus2 /> Add Friend
                            </Button>
                          ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <h2 className="text-center">No user yet!</h2>
                  </div>
                )}
              </div>
            </ScrollArea>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RightSideBar;
