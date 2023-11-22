"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketIOType = {
  socket: null | any | Socket;
  isConnected: boolean;
};

const SocketContext = createContext<SocketIOType>({
  socket: null,
  isConnected: false,
});

export function useSocket() {
  return useContext(SocketContext);
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io("ws://localhost:8090", {
      autoConnect: true,
      reconnection: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      setIsConnected(socket.connected);
    });

    socket.on("disconnect", () => {
      setIsConnected(socket.connected);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
