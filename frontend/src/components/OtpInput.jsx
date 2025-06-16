import React, { useRef, useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import {
  handleOtpChange,
  handleOtpKeyDown,
  handleOtpPaste,
} from "../common/otpHelper";
import "../styles/EmailVerify.css";

const OtpInputGroup = ({ control, setValue, name = "otp", error }) => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(""));

  // Sync internal OTP state with react-hook-form
  useEffect(() => {
    setValue(name, otp);
  }, [otp, name, setValue]);

  return (
    <>
      <div
        className="verify__inputs"
        onPaste={(e) => handleOtpPaste(e, setOtp, inputRefs)}
      >
        {otp.map((_, index) => (
          <Controller
            key={index}
            name={`${name}[${index}]`}
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                inputMode="numeric"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                value={field.value}
                onChange={(e) =>
                  handleOtpChange(e, index, otp, (val) => {
                    setOtp(val);
                    setValue(name, val);
                  }, inputRefs)
                }
                onKeyDown={(e) =>
                  handleOtpKeyDown(e, index, otp, (val) => {
                    setOtp(val);
                    setValue(name, val);
                  }, inputRefs)
                }
                className="verify__input"
              />
            )}
          />
        ))}
      </div>
      {error && <p className="auth__error">{error}</p>}
    </>
  );
};

export default OtpInputGroup;
