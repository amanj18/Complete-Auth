import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "../components/Button";
import { AppContent } from "../context/AppContext";
import "../styles/Auth.css"; // ✅ Reuse signup/login styles
import "../styles/Profile.css"; // ✅ Append only extra styles if needed

const Profile = () => {
  const { backendUrl, userData, getUserData } = useContext(AppContent);
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  // Load current user data into form
  useEffect(() => {
    if (userData) {
      setFullName(userData.fullName || "");
      setGender(userData.gender || "");
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/user/edit`,
        { fullName, gender },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message || "Profile updated successfully");
        getUserData();
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile");
    }
    setLoading(false);
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <h1 className="auth__title">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="auth__form">
          {/* Full Name */}
          <div className="auth__field">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Gender */}
          <div className="auth__field auth__field--radio-group">
            <label className="auth__label">Gender</label>
            <div className="auth__radio-options">
              <label className="auth__radio-label">
                <input
                  type="radio"
                  className="auth__radio-input"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Male
              </label>
              <label className="auth__radio-label">
                <input
                  type="radio"
                  className="auth__radio-input"
                  value="female"
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Female
              </label>
              <label className="auth__radio-label">
                <input
                  type="radio"
                  className="auth__radio-input"
                  value="other"
                  checked={gender === "other"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Other
              </label>
            </div>
          </div>

          <Button text={loading ? "Updating..." : "Update Profile"} disabled={loading} />
        </form>
      </div>
    </div>
  );
};

export default Profile;
