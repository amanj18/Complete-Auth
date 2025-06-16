import React, { useContext, useEffect } from "react";
import "../styles/EmailVerify.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { AppContent } from "../context/AppContext";
import { verifyEmailOtp } from "../api/auth";
import { otpSchema } from "../common/formValidation";
import { TEXT } from "../config/constant";

// Reusable components
import Button from "../components/Button";
import OtpInputGroup from "../components/OtpInput";

const EmailVerify = () => {
  const navigate = useNavigate();
  const { backendUrl, userData, getUserData, isLoggedIn } = useContext(AppContent);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: { otp: new Array(6).fill("") }
  });

  useEffect(() => {
    if (isLoggedIn && userData?.isAccountVerified) {
      navigate("/");
    }
  }, [userData, isLoggedIn]);

  const onSubmit = async ({ otp }) => {
    try {
      const otpCode = otp.join("");
      const { data } = await verifyEmailOtp(backendUrl, otpCode);
      if (data.success) {
        toast.success(data.message || "Email verified successfully");
        getUserData();
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
        <h1 className="verify__title">{TEXT.VERIFY_EMAIL_TITLE}</h1>
        <p className="verify__subtitle">{TEXT.VERIFY_EMAIL_SUBTITLE}</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <OtpInputGroup
            control={control}
            setValue={setValue}
            name="otp"
            error={errors.otp?.message}
          />
          <Button text={TEXT.VERIFY_EMAIL} />
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;
