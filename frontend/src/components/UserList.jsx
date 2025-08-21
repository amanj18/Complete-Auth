import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useSocket } from "../context/SocketContext";
import { AppContent } from "../context/AppContext";

const UserList = ({ onSelect }) => {
  const { backendUrl } = useContext(AppContent);
  const { onlineUsers } = useSocket();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get(`${backendUrl}/api/chat/users`, {
        withCredentials: true,
      });
      if (data.success) setUsers(data.users);
    };
    fetchUsers();
  }, [backendUrl]);

  return (
    <div>
      <h3 style={{ color: "white" }}>Users</h3>
      <ul>
        {users.map((u) => (
          <li
            key={u._id}
            onClick={() => onSelect(u)}
            style={{ cursor: "pointer", color: "white" }}
          >
            {u.fullName}{" "}
            <span
              style={{
                color: onlineUsers.includes(u._id) ? "lime" : "gray",
              }}
            >
              ●
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
