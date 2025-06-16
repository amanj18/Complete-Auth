import React from "react";
import "../styles/Auth.css";

const Button = ({ type = "submit", text, onClick }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="auth__button"
    >
      {text}
    </button>
  );
};

export default Button;