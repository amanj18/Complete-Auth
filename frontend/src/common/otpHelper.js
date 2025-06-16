export const handleOtpChange = (e, index, otp, setOtp, refs) => {
  const value = e.target.value.replace(/[^0-9]/g, "");
  if (!value) return;
  const newOtp = [...otp];
  newOtp[index] = value[0];
  setOtp(newOtp);
  if (index < 5) refs.current[index + 1]?.focus();
};

export const handleOtpKeyDown = (e, index, otp, setOtp, refs) => {
  if (e.key === "Backspace") {
    const newOtp = [...otp];
    if (otp[index]) {
      newOtp[index] = "";
      setOtp(newOtp);
    } else if (index > 0) {
      refs.current[index - 1]?.focus();
      newOtp[index - 1] = "";
      setOtp(newOtp);
    }
  }
};

export const handleOtpPaste = (e, setOtp, refs) => {
  e.preventDefault();
  const paste = e.clipboardData.getData("text").trim().slice(0, 6);
  const digits = paste.split("").filter((char) => /\d/.test(char));
  const newOtp = new Array(6).fill("");
  digits.forEach((digit, i) => {
    newOtp[i] = digit;
    if (refs.current[i]) refs.current[i].value = digit;
  });
  setOtp(newOtp);
  refs.current[Math.min(digits.length, 5)]?.focus();
};
