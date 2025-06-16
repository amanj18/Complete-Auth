import React from "react";
import "../styles/Auth.css"; // Reuse existing styles

const getPasswordStrength = (password) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score >= 4 ? 3 : score >= 2 ? 2 : 1;
};

const PasswordStrengthMeter = ({ password }) => {
  const level = getPasswordStrength(password);
  if (!password) return null;

  const labels = ["Weak", "Medium", "Strong"];
  const colors = ["#e74c3c", "#f39c12", "#2ecc71"];

  return (
    <div className="password-meter-group">
      <div className="password-meter__segments">
        {[1, 2, 3].map((bar) => (
          <div
            key={bar}
            className="password-meter__bar"
            style={{
              backgroundColor: level >= bar ? colors[bar - 1] : "#ccc"
            }}
          />
        ))}
      </div>
      <span className="password-meter__label">{labels[level - 1]}</span>
    </div>
  );
};

export default PasswordStrengthMeter;
