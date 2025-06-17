import React from "react";
import "../styles/Auth.css";

const SelectInput = ({ registerProps, error }) => {
  return (
    <div className="auth__field--radio-group">
      <label className="auth__label">Gender</label>
      <div className="auth__radio-options">
        <label className="auth__radio-label">
          <input
            type="radio"
            value="male"
            {...registerProps}
            className="auth__radio-input"
          />
          Male
        </label>
        <label className="auth__radio-label">
          <input
            type="radio"
            value="female"
            {...registerProps}
            className="auth__radio-input"
          />
          Female
        </label>
        <label className="auth__radio-label">
          <input
            type="radio"
            value="other"
            {...registerProps}
            className="auth__radio-input"
          />
          Other
        </label>
      </div>
      {error && <p className="auth__error">{error}</p>}
    </div>
  );
};

export default SelectInput;
