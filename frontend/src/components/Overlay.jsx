import React from "react";
import "../styles/Overlay.css"; // Ensure you have the appropriate styles for the overlay
import { FaTimes } from "react-icons/fa";

const OverlayPopup = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="overlay__backdrop" onClick={onClose}></div>

      <div className="overlay__content">
        <div className="overlay__header">
          <h2 className="overlay__title">{title}</h2>
          <button className="overlay__close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="overlay__body">{children}</div>
      </div>
    </div>
  );
};

export default OverlayPopup;
