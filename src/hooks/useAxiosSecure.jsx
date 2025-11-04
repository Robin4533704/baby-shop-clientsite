import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { getAuth } from "firebase/auth";
import UseAuth from "../auth-layout/useAuth";

// Axios instance
export const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true, // cross-origin cookie support
  headers: {
    "Content-Type": "application/json",
  },
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = UseAuth();

  useEffect(() => {
   
    const resInterceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      async (error) => {
        console.error("❌ Axios error:", error.response);
        if (error.response?.status === 401 || error.response?.status === 403) {
          await logOut();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    // Request interceptor: attach Firebase token
    const reqInterceptor = axiosSecure.interceptors.request.use(async (config) => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken(true);
          config.headers.Authorization = `Bearer ${token}`;
          console.log("🔐 Token attached:", token);
        } else {
          console.warn("⚠️ No logged-in user. Request may fail!");
        }
        return config;
      } catch (err) {
        console.error("❌ Error attaching token:", err);
        return config;
      }
    });

    // Cleanup interceptors on unmount
    return () => {
      axiosSecure.interceptors.response.eject(resInterceptor);
      axiosSecure.interceptors.request.eject(reqInterceptor);
    };
  }, [logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;

