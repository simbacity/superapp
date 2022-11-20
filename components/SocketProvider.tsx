import { createContext, ReactChild, useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(process.env.SOCKET_IO_URL || "");

export const SocketContext = createContext(socket);

interface SocketProviderProps {
  children: ReactChild;
}

export function SocketProvider(props: SocketProviderProps) {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on("connection", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [isConnected, setIsConnected]);

  return <SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>;
}
