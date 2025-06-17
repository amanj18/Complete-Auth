import React, { useContext } from 'react';
import { FaRegFaceSmileBeam } from "react-icons/fa6";
import '../styles/Header.css'; 
import { AppContent } from '../context/AppContext';

const Header = () => {
    const {userData} = useContext(AppContent);

  return (
    <header className="header">
      <h1 className="header__title">
        Hey {userData ? userData?.name : 'Developer'}
        {userData ? (
          <img src={userData?.profilePic} alt="User Avatar" className="header__avatar" />
        ) : (<FaRegFaceSmileBeam className="header__icon" />)}
      </h1>
      <h2 className="header__subtitle">Welcome to our app</h2>
      <p className="header__description">
        Discover powerful features to help you build, manage, and grow your applications with ease. Let’s get you started on something amazing!
      </p>
      <button className="header__button">Get Started</button>
    </header>
  );
};

export default Header;
