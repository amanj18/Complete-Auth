import { io } from "socket.io-client";

// Function that connects with a short-lived token
export const connectSocket = (backendUrl, socketToken) => {
  return io(backendUrl, {
    auth: { token: socketToken },
    withCredentials: true,
  });
};
