import React, { useEffect, useState, useRef, useContext } from "react";
import { useSocket } from "../context/SocketContext";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import "../styles/Chat.css";

const ChatWindow = ({ peer }) => {
  const { backendUrl, userData } = useContext(AppContent);
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const endRef = useRef(null);

  // Fetch history
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

  // Listen for new incoming messages
  useEffect(() => {
    if (!socket) return;
    socket.on("message:new", (msg) => {
      // ✅ Only append if it's not my own message
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

    // Add optimistically to UI
    setMessages((prev) => [...prev, newMsg]);

    // Send to server
    socket.emit("message:send", { to: peer._id, text });

    setText("");
  };
  return (
    <div className="chat-window">
      <h3 className="chat-window__title">Chat with {peer.name}</h3>
      <div className="chat-window__messages">
        {messages.map((m, i) => {
          const sender = String(m.senderId);
          const meId = String(userData._id);
          return (
            <p key={i} className="chat-window__message">
              <b>{sender === meId ? "You" : peer.fullName}:</b> {m.text}
            </p>
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
