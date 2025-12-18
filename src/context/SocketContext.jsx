import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    if (!user) return;

    const SOCKET_URL =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

    console.log("Connecting socket to:", SOCKET_URL);

    const s = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    setSocket(s);

    s.on("connect", () => {
      console.log("Socket connected:", s.id);
    });

    s.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    s.on("host-status", (status) => {
      setIsHost(status);
    });

    return () => {
      s.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isHost }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
