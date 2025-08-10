import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import "../styles/Auth.css";

import { AppContent } from "../context/AppContext";
import FloatAnimation from "../components/FloatAnimation";
import { toast } from "react-toastify";
import { signupUser } from "../api/auth";
import { TEXT } from "../config/constant";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../common/formValidation";

import AuthInput from "../components/AuthInput";
import AuthButton from "../components/Button";
import PasswordStrengthMeter from "../components/PassStrengthMeter";
import SelectInput from "../components/SelectInput";

const Signup = () => {
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async ({
    fullName,
    email,
    password,
    confirmPassword,
    gender,
  }) => {
    try {
      const { data } = await signupUser(backendUrl, {
        fullName,
        email,
        password,
        confirmPassword,
        gender,
      });
      if (data.success) {
        setIsLoggedIn(true);
        await getUserData();
        toast.success("Signup successful");
        navigate("/");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup error");
    }
  };

  return (
    <>
      <FloatAnimation />
      <div className="auth">
        <div className="auth__container">
          <h1 className="auth__title">{TEXT.SIGNUP_TITLE}</h1>
          <p className="auth__subtitle">{TEXT.SIGNUP_SUBTITLE}</p>

          <form className="auth__form" onSubmit={handleSubmit(onSubmit)}>
            <AuthInput
              icon={FaUser}
              type="text"
              placeholder="Full Name"
              registerProps={register("fullName")}
              error={errors.fullName?.message}
            />

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

            <PasswordStrengthMeter password={passwordValue} />

            <AuthInput
              icon={FaLock}
              type="password"
              placeholder="Confirm Password"
              registerProps={register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            {/* <SelectInput
              registerProps={register("gender")}
              error={errors.gender?.message}
            /> */}

            <AuthButton text={TEXT.SIGNUP} />

            <p className="auth__footer">
              {TEXT.ALREADY_HAVE_ACCOUNT}
              <Link to="/login" className="auth__switch">
                {TEXT.LOGIN}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
