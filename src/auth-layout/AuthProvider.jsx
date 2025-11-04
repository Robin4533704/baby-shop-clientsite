// AuthProvider.jsx
import React, { useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
  signInWithPopup, sendEmailVerification,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";

import { GithubAuthProvider } from "firebase/auth/web-extension";
import { auth } from "../../firebase.config";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("🚀 AuthProvider Mounted");
  console.log("🔄 Loading State:", loading);

  // ✅ create/register user
  const createUser = (email, password) => {
    console.log("🟢 Creating user:", email);
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password)
      .then(res => {
        console.log("✅ User Created:", res.user.email);
        return res;
      })
      .catch(err => {
        console.error("❌ Create User Error:", err);
        throw err;
      });
  };

  // ✅ Email Verification
  const sendVerificationEmail = () => {
    console.log("📧 Sending verification email...");
    if (auth.currentUser) {
      return sendEmailVerification(auth.currentUser)
        .then(() => console.log("✅ Verification email sent!"))
        .catch(err => console.error("❌ Email send error:", err));
    } else {
      console.warn("⚠️ No user logged in for verification email");
    }
  };

  // ✅ Forgot Password
  const sendPassword = (email) => {
    console.log("🔐 Sending password reset email to:", email);
    return sendPasswordResetEmail(auth, email)
      .then(() => console.log("✅ Password reset email sent"))
      .catch(err => console.error("❌ Reset email error:", err));
  };

  // ✅ sign in user
  const signInUser = (email, password) => {
    console.log("🔑 Logging in user:", email);
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password)
      .then(res => {
        console.log("✅ Login success:", res.user.email);
        return res;
      })
      .catch(err => {
        console.error("❌ Login error:", err);
        throw err;
      });
  };

  // ✅ Log out user
  const logOut = () => {
    console.log("🚪 Logging out user");
    setLoading(true);
    return signOut(auth)
      .then(() => console.log("✅ User logged out"))
      .catch(err => console.error("❌ Logout error:", err));
  };

  // ✅ Google login
  const signInGoogleUser = async () => {
    console.log("🌐 Google Login...");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("✅ Google Login:", result.user.email);
      setUser(result.user);
      return result;
    } catch (err) {
      console.error("❌ Google sign-in error:", err);
      throw err;
    }
  };

  // ✅ GitHub login
  const githubSignIn = async () => {
    console.log("🐙 GitHub Login...");
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("✅ GitHub Login:", result.user.email);
      setUser(result.user);
      return result;
    } catch (err) {
      console.error("❌ GitHub sign-in error:", err);
      throw err;
    }
  };

  // ✅ Update profile
  const updateUserProfiles = (profileInfo) => {
    console.log("📝 Updating profile:", profileInfo);
    return updateProfile(auth.currentUser, profileInfo)
      .then(() => console.log("✅ Profile Updated"))
      .catch(err => console.error("❌ Profile update error:", err));
  };

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);
    console.log("👤 User state changed:", currentUser);

    if (currentUser) {
      const token = await currentUser.getIdToken(true);
      localStorage.setItem("fbToken", token);
      console.log("🔐 FB Token saved:", token);
      
    } else {
      
      localStorage.removeItem("fbToken");
      localStorage.removeItem('token');
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, []);

  const authInfo = {
     user,createUser,
    signInUser,
    passwordReset: sendPasswordResetEmail,
    logOut,
    signInGoogleUser,
    updateUserProfiles,
    githubSignIn,
    loading,
    sendVerificationEmail,
    sendPassword,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
