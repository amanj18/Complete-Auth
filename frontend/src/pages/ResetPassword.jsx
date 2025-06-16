import React, { useState, useContext } from "react";
import "../styles/ResetPassword.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { AppContent } from "../context/AppContext";
import {
  resetEmailSchema,
  otpSchema,
  resetPasswordSchema,
} from "../common/formValidation";
import { sendResetOtp, resetPassword } from "../api/auth";
import { TEXT } from "../config/constant";

import AuthInput from "../components/AuthInput";
import Button from "../components/Button";
import OtpInput from "../components/OtpInput";
import PassStrengthMeter from "../components/PassStrengthMeter";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  // Step 1 - Email
  const {
    register: emailRegister,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: yupResolver(resetEmailSchema),
  });

  // Step 2 - OTP
  const {
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    control: otpControl,
    setValue: setOtpValue,
    watch,
  } = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: { otp: new Array(6).fill("") },
  });

  // Step 3 - Password
const {
  register: passwordRegister,
  handleSubmit: handlePasswordSubmit,
  formState: { errors: passwordErrors },
  watch: watchPassword
} = useForm({
  resolver: yupResolver(resetPasswordSchema),
});

const passwordValue = watchPassword("newPassword");

  const handleSendOtp = async (data) => {
    try {
      const { data: res } = await sendResetOtp(backendUrl, data.email);
      if (!res.success) return toast.error(res.message || "Failed to send OTP");
      toast.success(res.message || "OTP sent successfully");
      setEmail(data.email);
      setStep(2);
    } catch (error) {
      toast.error(error.message || "Error sending OTP");
    }
  };

  const handleVerifyOtp = (data) => {
    const code = data.otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setStep(3);
  };

  const handleResetPassword = async (data) => {
    try {
      const code = watch("otp").join("");
      const payload = {
        email,
        otp: code,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmPassword,
      };

      const { data: res } = await resetPassword(backendUrl, payload);
      if (res.success) {
        toast.success(res.message || "Password reset successfully");
        navigate("/login");
      } else {
        toast.error(res.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <h1 className="auth__title">{TEXT.RESET_PASSWORD_TITLE}</h1>
        <p className="auth__subtitle">{TEXT.RESET_PASSWORD_SUBTITLE}</p>

        {step === 1 && (
          <form onSubmit={handleEmailSubmit(handleSendOtp)}>
            <AuthInput
              type="email"
              placeholder="Enter your email"
              registerProps={emailRegister("email")}
              error={emailErrors.email?.message}
            />
            <Button text={TEXT.SEND_OTP} />
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit(handleVerifyOtp)}>
            <OtpInput
              control={otpControl}
              setValue={setOtpValue}
              name="otp"
              error={otpErrors.otp?.message}
            />
            <Button text={TEXT.CONTINUE} />
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit(handleResetPassword)}>
            <AuthInput
              type="password"
              placeholder="New Password"
              registerProps={passwordRegister("newPassword")}
              error={passwordErrors.newPassword?.message}
            />

            <PassStrengthMeter password={passwordValue} />

            <AuthInput
              type="password"
              placeholder="Confirm Password"
              registerProps={passwordRegister("confirmPassword")}
              error={passwordErrors.confirmPassword?.message}
            />
            <Button text={TEXT.RESET_PASSWORD} />
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
