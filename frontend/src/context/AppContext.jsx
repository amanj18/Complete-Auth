import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchWithLoading } from "../common/fetchWithLoading";

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
  axios.defaults.withCredentials = true; // Ensure cookies are sent with requests

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthState = async () => {
    setLoading(true); // ✅ show loader before fetch
    try {
      const { data } = await fetchWithLoading(
        () => axios.get(`${backendUrl}/api/auth/is-auth`),
        setLoading
      );
      if (data.success) {
        setIsLoggedIn(true);
        await getUserData(); // fetch user data after login
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false); // ✅ hide loader after all done
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await await fetchWithLoading(
      () => axios.get(`${backendUrl}/api/user/data`),
      setLoading
    );
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message || "Failed to fetch user data");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAuthState(); // Check authentication state on initial load
  }, []);

  const contextValue = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    loading,
    setLoading,
  };

  return (
    <AppContent.Provider value={contextValue}>{children}</AppContent.Provider>
  );
};
