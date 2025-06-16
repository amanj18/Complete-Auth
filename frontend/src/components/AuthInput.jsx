// src/components/AuthInput.jsx
import React, { useState } from "react";
import "../styles/Auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AuthInput = ({ icon: Icon, type, placeholder, error, registerProps }) => {
  const [isVisible, setIsVisible] = useState(false);
  const isPasswordType = type === "password";

  return (
    <>
      <div className="auth__field">
        {Icon && <Icon className="auth__icon" />}
        <input
          type={isPasswordType ? (isVisible ? "text" : "password") : type}
          placeholder={placeholder}
          {...registerProps}
        />
        {isPasswordType && (
          <span
            className="auth__toggle-password"
            onClick={() => setIsVisible((prev) => !prev)}
            role="button"
            tabIndex={0}
          >
            {isVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
      </div>
      {error && <p className="auth__error">{error}</p>}
    </>
  );
};

export default AuthInput;
