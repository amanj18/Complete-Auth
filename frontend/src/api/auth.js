import axios from "axios";

axios.defaults.withCredentials = true;

export const loginUser = (backendUrl, credentials) =>
  axios.post(`${backendUrl}/api/auth/login`, credentials);

export const signupUser = (backendUrl, userData) =>
  axios.post(`${backendUrl}/api/auth/signup`, userData);

export const sendResetOtp = (backendUrl, email) =>
  axios.post(`${backendUrl}/api/auth/send-resetPassword-otp`, { email });

export const resetPassword = (backendUrl, payload) =>
  axios.post(`${backendUrl}/api/auth/reset-password`, payload);

export const verifyEmailOtp = (backendUrl, otpCode) =>
  axios.post(`${backendUrl}/api/auth/verify-account`, { otp: otpCode });