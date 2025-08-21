import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useSocket } from "../context/SocketContext";
import { AppContent } from "../context/AppContext";
import { RxCross2 } from "react-icons/rx";

const UserList = ({ onSelect }) => {
  const { backendUrl } = useContext(AppContent);
  const { onlineUsers } = useSocket();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get(`${backendUrl}/api/chat/users`, {
        withCredentials: true,
      });
      if (data.success) setUsers(data.users);
    };
    fetchUsers();
  }, [backendUrl]);

  const filteredUsers = users.filter((u) =>
    u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="chat-sidebar__header">
        <h3 className="chat-sidebar__title">Chats</h3>
        <div className="chat-sidebar__search-wrapper">
          <input
            type="text"
            className="chat-sidebar__search"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="chat-sidebar__search-clear"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              type="button"
            >
              <RxCross2 />
            </button>
          )}
        </div>
      </div>
      <ul className="chat-sidebar__list">
        {filteredUsers.map((u) => (
          <li
            key={u._id}
            className="chat-sidebar__item"
            onClick={() => onSelect(u)}
          >
            <div className="chat-sidebar__avatar">
              {u.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="chat-sidebar__details">
              <span className="chat-sidebar__name">{u.fullName}</span>
              <span className="chat-sidebar__status">
                {onlineUsers.includes(u._id) ? "Online" : "Offline"}
              </span>
            </div>
            <span
              className={`chat-sidebar__status-dot ${
                onlineUsers.includes(u._id) ? "online" : "offline"
              }`}
            ></span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default UserList;