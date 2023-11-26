import { io } from "socket.io-client";
import { HOST_NAME } from "../../utils/config";
import { createContext, useEffect, useState } from "react";

export const SocketCon = createContext();

function SocketContext({ children }) {
  const [socket, setSocket] = useState(null);
  const [usersop, setusers] = useState([]);
  useEffect(() => {
    const newSocket = io(HOST_NAME);
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);
  const addUsers = async (id) => {
    await socket.emit("add_new_user", id);
    socket.on("get_user", (users) => {
      setusers(users);
    });
  };

  return (
    <SocketCon.Provider value={{ socket, usersop, addUsers }}>
      {socket && children}
    </SocketCon.Provider>
  );
}

export default SocketContext;
