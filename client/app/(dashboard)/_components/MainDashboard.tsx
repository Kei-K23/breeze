"use client";
import { useEffect, useState } from "react";
import { MessageChat } from "./MessageChat";
import LeftSideBar, { FetchGroupsDataType } from "./LeftSideBar";
import RightSideBar, { FetchUsersDataType, UserType } from "./RightSideBar";
import toast from "react-hot-toast";
import { useSocket } from "@/provider/socket-provider";
import { createRefreshTokenCookie } from "@/app/actions";

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
  isCookieExist: string;
}

const MainDashboard = ({
  cookie,
  currentUser,
  groupData,
  isCookieExist,
  usersData,
  fetchMessagesDataFromPage,
}: MainProps) => {
  const [selectedChatGroup, setSelectedChatGroup] = useState("");
  const [fetchMessages, setFetchMessages] = useState<IMessage[]>(
    fetchMessagesDataFromPage
  );

  const { socket } = useSocket();

  useEffect(() => {
    if (isCookieExist == "0") {
      createRefreshTokenCookie(cookie);
    }
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
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/messages/${selectedChatGroup}?limit=${limit}&breeze_csrf=${cookie}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            Cookie: `breeze_csrf=${cookie}`,
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
        cookie={cookie}
      />
    </div>
  );
};

export default MainDashboard;
