import React, { useEffect, useState, useRef, useContext } from "react";
import { useSocket } from "../context/SocketContext";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import "../styles/Chat.css"; // ✅ new styles

const ChatWindow = ({ peer }) => {
  const { backendUrl, userData } = useContext(AppContent);
  const { socket, onlineUsers } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    if (!peer) return;
    const fetchHistory = async () => {
      const { data } = await axios.get(
        `${backendUrl}/api/chat/messages/${peer._id}`,
        { withCredentials: true }
      );
      if (data.success) setMessages(data.messages);
    };
    fetchHistory();
  }, [peer, backendUrl]);

  useEffect(() => {
    if (!socket) return;
    socket.on("message:new", (msg) => {
      if (msg.senderId !== userData._id) {
        if (msg.senderId === peer._id || msg.receiverId === peer._id) {
          setMessages((prev) => [...prev, msg]);
        }
      }
    });
    return () => socket?.off("message:new");
  }, [socket, peer, userData]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!text.trim() || !socket) return;
    const newMsg = {
      senderId: userData._id,
      receiverId: peer._id,
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    socket.emit("message:send", { to: peer._id, text });
    setText("");
  };

  return (
    <div className="chat-window">
      <div className="chat-window__header">
        <img
          src={peer.profilePic || "https://avatar.iran.liara.run/public/20"}
          alt={peer.fullName}
          className="chat-window__avatar"
        />
        <div className="chat-window__user-info">
          <h3 className="chat-window__title">{peer.fullName}</h3>
          <span
            className={`chat-window__status ${
              onlineUsers.includes(peer._id) ? "online" : "offline"
            }`}
          >
            {onlineUsers.includes(peer._id) ? "Online" : "Offline"}
          </span>
        </div>
      </div>
      <div className="chat-window__messages">
        {messages.map((m, i) => {
          const sender = String(m.senderId);
          const meId = String(userData._id);
          const isMe = sender === meId;
          return (
            <div
              key={i}
              className={
                isMe ? "chat-window__message--me" : "chat-window__message--peer"
              }
            >
              <div
                className={
                  isMe ? "chat-window__name--me" : "chat-window__name--peer"
                }
              >
                {isMe ? "You" : peer.fullName}
              </div>
              <div className="chat-window__bubble">{m.text}</div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <div className="chat-window__input-area">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="chat-window__input"
        />
        <button onClick={send} className="auth__button">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
