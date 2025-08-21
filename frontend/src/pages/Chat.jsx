  import React, { useState } from "react";
  import UserList from "../components/UserList";
  import ChatWindow from "../components/ChatWindow";
  import FloatAnimation from "../components/FloatAnimation";
  import Navbar from "../components/Navbar";
  import "../styles/Chat.css";

  const Chat = () => {
    const [peer, setPeer] = useState(null);

    return (
      <>
        <FloatAnimation />
        <Navbar />
        <div className="chat-page">
        <div className="chat-page__sidebar">
          <UserList onSelect={setPeer} />
        </div>
        <div className="chat-page__content">
          {peer ? (
            <ChatWindow peer={peer} />
          ) : (
            <p>Select a user to chat</p>
          )}
        </div>
      </div>
      </>
    );
  };

  export default Chat;
