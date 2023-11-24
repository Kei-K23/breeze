"use client";
import { useState } from "react";
import { MessageChat } from "./Chat";
import LeftSideBar, { FetchGroupsDataType } from "./LeftSideBar";
import RightSideBar, { FetchUsersDataType, UserType } from "./RightSideBar";

interface MainProps {
  cookie: string;
  currentUser: UserType;
  groupData: FetchGroupsDataType;
  usersData: FetchUsersDataType;
}

const MainDashboard = ({
  cookie,
  currentUser,
  groupData,
  usersData,
}: MainProps) => {
  const GLOBAL_CHAT_ROOM_ID = process.env.NEXT_PUBLIC_GLOBAL_CHAT_ROOM_ID;
  const [selectedChatGroup, setSelectedChatGroup] =
    useState(GLOBAL_CHAT_ROOM_ID);

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
        cookie={cookie}
        currentUser={currentUser}
        usersData={usersData.data as UserType[]}
        selectedChatGroup={selectedChatGroup as string}
      />
      <RightSideBar currentUser={currentUser} usersData={usersData} />
    </div>
  );
};

export default MainDashboard;
