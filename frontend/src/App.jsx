import React from "react";
import { Routes, Route } from "react-router-dom";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { AppContent } from "./context/AppContext";
import Loader from "./components/Loader";
import Profile from "./pages/Profile";
import { SocketProvider } from "./context/SocketContext";

const App = () => {
  const { loading } = useContext(AppContent);
  return (
    <>
      {loading && <Loader />}
      <ToastContainer />
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/email-verify" element={<EmailVerify />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </SocketProvider>
    </>
  );
};

export default App;
