// src/pages/Register.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, XCircle, Upload, Image } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UseAuth from "../auth-layout/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { createUser, updateUserProfiles } = UseAuth();
  const  axiosSecure  = useAxiosSecure();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("image", file);

    const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
    setUploading(true);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: form,
      });

      if (!response.ok) throw new Error("Image upload failed with status " + response.status);

      const data = await response.json();
      if (data?.success) {
        setProfilePic(data.data.url);
        toast.success("Profile picture uploaded successfully!");
      } else {
        toast.error("Image upload failed. Try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Image upload failed. Check your internet connection.");
    } finally {
      setUploading(false);
    }
  };

  const removeProfilePic = () => setProfilePic("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Firebase signup
      const userCredential = await createUser(formData.email, formData.password);
      const firebaseUser = userCredential.user;

      // 2️⃣ Update Firebase profile
      await updateUserProfiles({
        displayName: formData.name,
        photoURL: profilePic || "",
      });

      // 3️⃣ Get Firebase token
      const token = await firebaseUser.getIdToken(true);

     
      const userInfo = {
        uid: firebaseUser.uid,
        email: firebaseUser.email.toLowerCase(),
        name: formData.name,
        photoURL: profilePic || "",
        role: "user",
        emailVerified: firebaseUser.emailVerified,
      };

      // 5️⃣ Send to backend
      const res = await axiosSecure.post("/users", userInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        toast.success("Registration Successful! Welcome to Baby Shop 💕");
        setShowSuccess(true);

        // Optional: you already have the role from backend
        const role = res.data.user.role || "user";
        console.log("User role:", role);

        // Redirect after 2s
        setTimeout(() => navigate(from, { replace: true }), 2000);
      } else {
        throw new Error(res.data?.message || "User creation failed");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      let message = err?.response?.data?.message || err.message || "Registration failed!";
      if (err.code === "auth/email-already-in-use") {
        message = "This email is already registered. Please login instead.";
      }
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center p-4">
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center space-x-3">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Registration Successful!</p>
              <p className="text-sm opacity-90">Redirecting...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-md w-full">
        {/* <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button> */}

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join us and discover amazing products</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center space-x-3">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Upload */}
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture (Optional)</label>
              <div className="flex flex-col items-center space-y-4">
                {profilePic ? (
                  <div className="relative">
                    <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-pink-200 shadow-lg" />
                    <button type="button" onClick={removeProfilePic} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                )}

                <label className="cursor-pointer">
                  <input type="file" onChange={handleImageUpload} accept="image/*" className="hidden" disabled={uploading} />
                  <div className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
                    {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Upload className="w-4 h-4" />}
                    <span>{uploading ? "Uploading..." : "Choose Image"}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name" className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email" className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required placeholder="Create a password (min. 6 characters)" className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading || uploading} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <div className="flex items-center justify-center space-x-2"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Creating Account...</span></div> : "Create Account"}
            </motion.button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account? <Link to="/login" className="text-pink-600 hover:text-pink-700 font-semibold transition-colors">Sign in here</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
