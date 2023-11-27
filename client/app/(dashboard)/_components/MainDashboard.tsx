"use client";
import { useEffect, useState } from "react";
import { MessageChat } from "./MessageChat";
import LeftSideBar, { FetchGroupsDataType } from "./LeftSideBar";
import RightSideBar, { FetchUsersDataType, UserType } from "./RightSideBar";
import toast from "react-hot-toast";
import { useSocket } from "@/provider/socket-provider";

export interface IMessage {
  senderId: string;
  receiverId: Array<string>;
  groupId: string;
  textMessage: string;
  isRead?: boolean;
  createdAt?: Date;
}
interface MainProps {
  cookie: string;
  currentUser: UserType;
  groupData: FetchGroupsDataType;
  usersData: FetchUsersDataType;
  fetchMessagesDataFromPage: IMessage[];
}

const MainDashboard = ({
  cookie,
  currentUser,
  groupData,
  usersData,
  fetchMessagesDataFromPage,
}: MainProps) => {
  const GLOBAL_CHAT_ROOM_ID = process.env.NEXT_PUBLIC_GLOBAL_CHAT_ROOM_ID;

  const [selectedChatGroup, setSelectedChatGroup] = useState("");
  const [fetchMessages, setFetchMessages] = useState<IMessage[]>(
    fetchMessagesDataFromPage
  );

  const { socket } = useSocket();

  useEffect(() => {
    fetchMessagesData();
    if (socket) {
      socket.emit("join_room", {
        roomId: selectedChatGroup,
        name: currentUser.name,
      });
      socket.emit("client_connect", {
        id: currentUser._id,
        roomId: selectedChatGroup,
      });

      return () => {
        socket.off("join_room");
        socket.off("client_connect");
        socket.emit("leave_room", { roomId: selectedChatGroup });
      };
    }
  }, [selectedChatGroup, socket]);

  async function fetchMessagesData(limit = 15) {
    if (!selectedChatGroup) return;
    try {
      const messagesRes = await fetch(
        `http://localhost:8090/api/messages/${selectedChatGroup}/?limit=${limit}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
          next: { revalidate: 0 },
        }
      );
      const messagesData = await messagesRes.json();

      if (messagesRes.ok && messagesData.success) {
        setFetchMessages(messagesData.data);
      } else {
        setFetchMessages([]);
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong went retrieving messages!");
    }
  }

  return (
    <div className="h-full flex items-center ">
      <LeftSideBar
        setSelectedChatGroup={setSelectedChatGroup}
        selectedChatGroup={selectedChatGroup}
        cookie={cookie}
        currentUser={currentUser}
        groupData={groupData}
        usersData={usersData}
      />
      <MessageChat
        fetchMessages={fetchMessages}
        setFetchMessages={setFetchMessages}
        setSelectedChatGroup={setSelectedChatGroup}
        cookie={cookie}
        currentUser={currentUser}
        usersData={usersData.data as UserType[]}
        selectedChatGroup={selectedChatGroup as string}
      />
      <RightSideBar
        setSelectedChatGroup={setSelectedChatGroup}
        selectedChatGroup={selectedChatGroup as string}
        currentUser={currentUser}
        usersData={usersData}
      />
    </div>
  );
};

export default MainDashboard;
