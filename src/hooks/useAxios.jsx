import { useEffect } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import UseAuth from '../auth-layout/useAuth';

// axios instance
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const useAxios = () => {
  const navigate = useNavigate();
  const { logOut } = UseAuth();

  useEffect(() => {
    // Response interceptor
    const resInterceptor = axiosInstance.interceptors.response.use(
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
    const reqInterceptor = axiosInstance.interceptors.request.use(async (config) => {
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
      } catch (err) {
        console.error("❌ Error attaching token:", err);
      }
      return config;
    });

    // Cleanup interceptors on unmount
    return () => {
      axiosInstance.interceptors.response.eject(resInterceptor);
      axiosInstance.interceptors.request.eject(reqInterceptor);
    };
  }, [logOut, navigate]);

  return axiosInstance;
};

export default useAxios;