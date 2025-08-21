import React, { useState, useRef, useEffect } from "react";
import { FaCheckCircle, FaSignOutAlt, FaEdit, FaHome } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { useNavigate, useLocation } from "react-router-dom";
import { IoChatboxEllipses } from "react-icons/io5";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import OverlayPopup from "./Overlay"; // If you use the delete overlay

const UserDropdown = ({
  userData,
  setUserData,
  setIsLoggedIn,
  backendUrl,
  dropdownOpen,
  setDropdownOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Delete overlay state
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setDropdownOpen]);

  const handleLogout = async () => {
    try {
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
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`
      );
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

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteLoading(true);
    try {
      const { data } = await axios.delete(`${backendUrl}/api/user/delete`, {
        data: { password: deletePassword },
        withCredentials: true,
      });
      if (data.success) {
        toast.success("Account deleted successfully");
        setIsLoggedIn(false);
        setUserData(null);
        setShowDeleteOverlay(false);
        navigate("/");
      } else {
        toast.error(data.message || "Failed to delete account");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting account");
    }
    setDeleteLoading(false);
    setDeletePassword("");
  };

  return (
    <div className="navbar__user" ref={dropdownRef}>
      <button
        className="navbar__avatar"
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        {userData?.name ? userData.name[0].toUpperCase() : ""}
      </button>
      {dropdownOpen && (
        <div className="navbar__dropdown">
          {location.pathname !== "/" && (<button
            className="navbar__dropdown-item"
            onClick={() => {
              setDropdownOpen(false);
              navigate("/");
            }}
          >
            <FaHome className="navbar__dropdown-icon" /> Home
          </button> )}
          {location.pathname !== "/chat" && (<button
            className="navbar__dropdown-item"
            onClick={() => {
              setDropdownOpen(false);
              navigate("/chat");
            }}
          >
            <IoChatboxEllipses className="navbar__dropdown-icon" /> Message
          </button> )}
          {!userData.isAccountVerified && location.pathname !== "/email-verify" && (
            <button className="navbar__dropdown-item" onClick={handleVerifyOtp}>
              <FaCheckCircle className="navbar__dropdown-icon" />
              Verify Email
            </button>
          )}
          {location.pathname !== "/profile" && (<button
            className="navbar__dropdown-item"
            onClick={() => {
              setDropdownOpen(false);
              navigate("/profile");
            }}
          >
            <FaEdit className="navbar__dropdown-icon" /> Edit Profile
          </button> )}
          <button
            className="navbar__dropdown-item"
            onClick={() => {
              setDropdownOpen(false);
              setShowDeleteOverlay(true);
            }}
          >
            <RiDeleteBinFill className="navbar__dropdown-icon" />
            Delete Account
          </button>
          <button className="navbar__dropdown-item" onClick={handleLogout}>
            <FaSignOutAlt className="navbar__dropdown-icon" />
            Logout
          </button>
        </div>
      )}

      {/* Overlay for Delete Account */}
      <OverlayPopup
        isOpen={showDeleteOverlay}
        onClose={() => {
          setShowDeleteOverlay(false);
          setDeletePassword("");
        }}
        title="Delete Account"
      >
        <form onSubmit={handleDeleteAccount} className="auth__form">
          <label className="auth__label">Enter your password to confirm:</label>
          <div className="auth__field auth__field--column">
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={deleteLoading}
            className="auth__button auth__button--danger"
          >
            {deleteLoading ? "Deleting..." : "Delete Account"}
          </button>
        </form>
      </OverlayPopup>
    </div>
  );
};

export default UserDropdown;
