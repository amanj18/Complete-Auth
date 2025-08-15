import React, { useContext, useEffect, useRef, useState } from "react";
import "../styles/Navbar.css";
import { FaSignInAlt, FaCheckCircle, FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/images/auth-logo.png";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { AppContent } from "../context/AppContext";
import UserDropdown from "./Dropdown";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, setUserData, setIsLoggedIn, backendUrl } =
    useContext(AppContent);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <nav className="navbar">
      <div className="navbar__logo">
        MyLogo
        <img src={logo} alt="logo" className="navbar__logo-img" />
      </div>

      {userData?.name ? (
        <UserDropdown
          userData={userData}
          setUserData={setUserData}
          setIsLoggedIn={setIsLoggedIn}
          backendUrl={backendUrl}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
        />
      ) : (
        <button
          className="navbar__login-button"
          onClick={() => navigate("/login")}
        >
          <FaSignInAlt className="navbar__login-icon" />
          Login
        </button>
      )}
    </nav>
  );
};

export default Navbar;
