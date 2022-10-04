import { useContext } from "react";

import { SocketContext } from "@components/SocketProvider";

export const useSocket = () => {
  const socket = useContext(SocketContext);

  return socket;
};
