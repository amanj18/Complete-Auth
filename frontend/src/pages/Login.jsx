import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "../styles/Auth.css";
import { AppContent } from "../context/AppContext";
import FloatAnimation from "../components/FloatAnimation";
import { toast } from "react-toastify";
import { loginUser } from "../api/auth.js";
import { TEXT } from "../config/constant.js";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../common/formValidation";

// Reusable components
import AuthInput from "../components/AuthInput";
import Button from "../components/Button";
import Navbar from "../components/Navbar.jsx";

const Login = () => {
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }) => {
    try {
      const { data } = await loginUser(backendUrl, { email, password });
      if (data.success) {
        setIsLoggedIn(true);
        await getUserData();
        toast.success("Login successful");
        navigate("/");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
    }
  };

  return (
   <>
      <FloatAnimation />
      <Navbar />
      <div className="auth">
        <div className="auth__container">
          <h1 className="auth__title">{TEXT.LOGIN_TITLE}</h1>
          <p className="auth__subtitle">{TEXT.LOGIN_SUBTITLE}</p>

          <form className="auth__form" onSubmit={handleSubmit(onSubmit)}>
            <AuthInput
              icon={FaEnvelope}
              type="email"
              placeholder="Email Address"
              registerProps={register("email")}
              error={errors.email?.message}
            />

            <AuthInput
              icon={FaLock}
              type="password"
              placeholder="Password"
              registerProps={register("password")}
              error={errors.password?.message}
            />

            <div className="auth__forgot">
              <button
                type="button"
                onClick={() => navigate("/reset-password")}
              >
                {TEXT.FORGOT_PASSWORD}
              </button>
            </div>

            <Button text={TEXT.LOGIN} />

            <p className="auth__footer">
              {TEXT.DONT_HAVE_ACCOUNT}
              <Link to="/signup" className="auth__switch">
                {TEXT.SIGNUP}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
