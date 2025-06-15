import React, { useContext, useEffect, useRef, useState } from "react";
import "../styles/EmailVerify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";

const EmailVerify = () => {
  axios.defaults.withCredentials = true; // Ensure cookies are sent with requests
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const { backendUrl, userData, getUserData, isLoggedIn } =
    useContext(AppContent);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value[0];
    setOtp(newOtp);

    // Move to next input
    if (index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim().slice(0, 6);
    const digits = paste.split("").filter((char) => /\d/.test(char));
    const newOtp = [...otp];

    digits.forEach((digit, i) => {
      newOtp[i] = digit;
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = digit;
      }
    });

    setOtp(newOtp);

    // Move to last filled field
    if (digits.length < 6) {
      inputRefs.current[digits.length]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [userData, isLoggedIn]);

  const handleVerify = async (e) => {
    try {
      e.preventDefault();
      const otpCode = otp.join("");
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { otp: otpCode }
      );
      if (data.success) {
        toast.success(data.message || "Email verified successfully");
        getUserData(); // Refresh user data after verification
        navigate("/");
      } else {
        toast.error(data.message || "Failed to verify email");
      }
    } catch (error) {
      toast.error(error.message || "Error verifying email");
    }
  };

  return (
    <div className="verify">
      <div className="verify__container">
        <h1 className="verify__title">Verify Your Email</h1>
        <p className="verify__subtitle">
          Enter the 6-digit code sent to your email address.
        </p>

        <div className="verify__inputs" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="verify__input"
            />
          ))}
        </div>

        <button className="verify__button" onClick={handleVerify}>
          Verify Email
        </button>
      </div>
    </div>
  );
};

export default EmailVerify;
