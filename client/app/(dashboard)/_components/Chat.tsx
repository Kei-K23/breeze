"use client";

import { Plus, Send, UserCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { UserType } from "./RightSideBar";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const users = [
  {
    name: "Olivia Martin",
    email: "m@example.com",
    avatar: "/avatars/01.png",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    avatar: "/avatars/03.png",
  },
  {
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar: "/avatars/05.png",
  },
  {
    name: "Jackson Lee",
    email: "lee@example.com",
    avatar: "/avatars/02.png",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    avatar: "/avatars/04.png",
  },
] as const;

type User = (typeof users)[number];

interface MessageChatProps {
  selectedChatGroup: String;
}

export function MessageChat({ selectedChatGroup }: MessageChatProps) {
  const [group, setGroup] = useState<{
    _id: string;
    groupName: string;
    groupDescription: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
  }>();
  const [groupMembers, setGroupMembers] = useState<Array<UserType>>([]);

  useEffect(() => {
    fetchChatGroupData();
  }, [selectedChatGroup]);

  // fetch chat group data
  async function fetchChatGroupData() {
    try {
      const resGroup = await fetch(
        `http://localhost:8090/api/groups?groupId=${selectedChatGroup}`,
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
        const resGroupMembers = await fetch(
          `http://localhost:8090/api/groups?groupIdForMembers=${selectedChatGroup}`,
          {
            method: "GET",
            credentials: "include",
            next: {
              revalidate: 0,
            },
          }
        );

        const groupMembersData = await resGroupMembers.json();

        if (resGroupMembers.ok && groupMembersData.success) {
          console.log(groupData.data);

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

  const formRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState([
    {
      role: "agent",
      content: "Hi, how can I help you today?",
    },
    {
      role: "user",
      content: "Hey, I'm having trouble with my account.",
    },
    {
      role: "agent",
      content: "What seems to be the problem?",
    },
    {
      role: "user",
      content: "I can't log in.",
    },
    {
      role: "agent",
      content: "What seems to be the problem?",
    },
    {
      role: "user",
      content: "I can't log in.",
    },
    {
      role: "agent",
      content: "What seems to be the problem?",
    },
    {
      role: "user",
      content: "I can't log in.",
    },
    {
      role: "agent",
      content: "What seems to be the problem?",
    },
    {
      role: "user",
      content: "I can't log in.",
    },
    {
      role: "agent",
      content: "What seems to be the problem?",
    },
    {
      role: "user",
      content: "I can't log in.",
    },
  ]);
  const [input, setInput] = useState("");
  const inputLength = input.trim().length;

  return (
    <>
      <Card className="h-full w-full flex-1 ">
        <CardHeader className="flex flex-row items-center">
          <div className="flex items-center justify-between w-full space-x-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm font-medium leading-none mb-2">
                  {group?.groupName}
                </p>
                {group?.groupDescription && (
                  <p className="text-sm text-muted-foreground">
                    {group.groupDescription}
                  </p>
                )}
              </div>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="ml-auto rounded-full"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Add new member</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add new member</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Badge className="absolute -top-3 -right-3 z-10 cursor-pointer">
                {groupMembers.length}
              </Badge>
              <ScrollArea className=" w-52 rounded-md border ">
                <div className="flex w-max items-center gap-3 cursor-pointer m-2">
                  {groupMembers.map((member) => (
                    <div key={member._id}>
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {member?.picture ? (
                              <Image
                                src={member?.picture as string}
                                alt={member?.name as string}
                                width={40}
                                height={40}
                                className={`rounded-full  ${
                                  member._id === group?.ownerId &&
                                  "ring-2 ring-sky-500"
                                } `}
                              />
                            ) : (
                              <UserCircle2
                                className={`w-10 h-10 rounded-full  ${
                                  member._id === group?.ownerId &&
                                  "ring-2 ring-sky-500"
                                } `}
                              />
                            )}
                          </TooltipTrigger>
                          <TooltipContent>{member.name}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}
                </div>
                <ScrollBar
                  className="h-2 cursor-grabbing "
                  orientation="horizontal"
                />
              </ScrollArea>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            ref={formRef}
            className="space-y-4 overflow-auto h-[640px] no-scrollbar"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (inputLength === 0) return;
              setMessages([
                ...messages,
                {
                  role: "user",
                  content: input,
                },
              ]);
              setInput("");
              setTimeout(() => {
                if (formRef.current) {
                  formRef.current.scrollTop =
                    formRef.current.scrollHeight + 100000;
                }
              }, 0);
            }}
            className="flex w-full items-center space-x-2"
          >
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <Button type="submit" size="icon" disabled={inputLength === 0}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </>
  );
}
