import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const AuthForm = () => {
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent);

  const [mode, setMode] = useState("signup"); // 'signup' or 'login'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const toggleMode = () => {
    setMode((prev) => (prev === "signup" ? "login" : "signup"));
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true; // Ensure cookies are sent with requests
      if (mode === "signup") {
        const { data } = await axios.post(`${backendUrl}/api/auth/signup`, {
          name,
          email,
          password,
        });
        if (data.success) {
          setIsLoggedIn(true);
          await getUserData(); // Fetch user data after signup
          toast.success("Signup successful");
          navigate("/");
        } else {
          toast.error(data.message || "Signup failed");
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });
        if (data.success) {
          setIsLoggedIn(true);
          await getUserData(); // Fetch user data after login
          toast.success("Login successful");
          navigate("/");
        } else {
          toast.error(data.message || "Login failed");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
    }
  };

  const handleForgotPassword = () => {
    navigate("/reset-password");
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <h1 className="auth__title">
          {mode === "signup" ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="auth__subtitle">
          {mode === "signup"
            ? "Join us and start your journey!"
            : "Login to continue"}
        </p>

        <form className="auth__form" onSubmit={handleSubmit}>
          {/* Full Name Field */}
          {mode === "signup" && (
            <div className="auth__field">
              <FaUser className="auth__icon" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Email Field */}
          <div className="auth__field">
            <FaEnvelope className="auth__icon" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="auth__field">
            <FaLock className="auth__icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Forgot Password */}
          {mode === "login" && (
            <div className="auth__forgot">
              <button type="button" onClick={handleForgotPassword}>
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="auth__button">
            {mode === "signup" ? "Sign Up" : "Login"}
          </button>

          {/* Switch Mode */}
          <p className="auth__footer">
            {mode === "signup"
              ? "Already have an account?"
              : "Don't have an account?"}
            <button type="button" onClick={toggleMode} className="auth__switch">
              {mode === "signup" ? "Login" : "Sign Up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
