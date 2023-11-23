import { io } from "socket.io-client";
import { HOST_NAME } from "../../utils/config";
import { createContext, useEffect, useState } from "react";

export const SocketCon = createContext();

function SocketContext({ children }) {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = io(HOST_NAME);
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketCon.Provider value={{ socket }}>
      {socket && children}
    </SocketCon.Provider>
  );
}

export default SocketContext;
