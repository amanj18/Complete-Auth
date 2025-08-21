import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { connectSocket } from "../socket";
import { AppContent } from "./AppContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { backendUrl, isLoggedIn } = useContext(AppContent);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) return;

    // ✅ fetch short-lived socket token (backend sends it using httpOnly cookie)
    const initSocket = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/chat/socket-token`, {
          withCredentials: true,
        });
        if (data.token) {
          const s = connectSocket(backendUrl, data.token);
          setSocket(s);

          s.on("presence:update", (ids) => {
            setOnlineUsers(ids);
          });

          return () => {
            s.disconnect();
            setSocket(null);
          };
        }
      } catch (err) {
        console.error("Socket init failed", err);
      }
    };

    initSocket();
  }, [backendUrl, isLoggedIn]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
