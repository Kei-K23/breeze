"use client";

import { useSocket } from "@/provider/socket-provider";
import { Badge } from "./ui/badge";
import { AnnoyedIcon, Smile } from "lucide-react";
const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge className="text-yellow-600">
        <AnnoyedIcon /> <h3 className="ml-2 ">Connecting</h3>
      </Badge>
    );
  }

  return (
    <Badge className="text-green-600">
      <Smile /> <h3 className="ml-2 ">Real-Time connection</h3>
    </Badge>
  );
};

export default SocketIndicator;
