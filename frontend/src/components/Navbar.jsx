import React, { useContext, useEffect, useRef, useState } from "react";
import "../styles/Navbar.css";
import { FaSignInAlt, FaCheckCircle, FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/images/auth-logo.png";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData,setUserData, setIsLoggedIn, backendUrl } = useContext(AppContent);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try{
        const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
        if (data.success) {
            setIsLoggedIn(false);
            setUserData(null);
            navigate("/");
        } 
    } catch (error) {
        toast.error(error.message || "Logout failed");
    }
  };

  const handleVerifyOtp = async () => {
    try{
        const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`);
        if (data.success) {
            toast.success(data.message || "Verification email sent");
            navigate("/email-verify");
        } else {
            toast.error(data.message || "Failed to send verification email");
        }
    } catch (error) {
        toast.error(error.message || "Error sending verification email");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderInitial = () => {
    return userData?.name ? userData.name[0].toUpperCase() : "";
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        MyLogo
        <img src={logo} alt="logo" className="navbar__logo-img" />
      </div>

      {userData?.name ? (
        <div className="navbar__user" ref={dropdownRef}>
          <button className="navbar__avatar" onClick={toggleDropdown}>
            {renderInitial()}
          </button>

          {dropdownOpen && (
            <div className="navbar__dropdown">
              {!userData.isAccountVerified && (
                <button className="navbar__dropdown-item" onClick={handleVerifyOtp}>
                  <FaCheckCircle className="navbar__dropdown-icon" />
                  Verify Email
                </button>
              )}
              <button className="navbar__dropdown-item" onClick={handleLogout}>
                <FaSignOutAlt className="navbar__dropdown-icon" />
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button className="navbar__login-button" onClick={() => navigate("/login")}>
          <FaSignInAlt className="navbar__login-icon" />
          Login
        </button>
      )}
    </nav>
  );
};

export default Navbar;
