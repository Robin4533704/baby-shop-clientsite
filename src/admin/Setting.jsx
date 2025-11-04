// src/admin/Settings.jsx
import React, { useState, useEffect } from "react";
import { 
  FaUser, 
  FaLock, 
  FaSave, 
  FaShieldAlt,
  FaBell,
  FaPalette,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaMobile,
  FaShoppingBag,
  FaTag,
  FaMoon,
  FaSun,
  FaGlobe
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import UseAuth from "../auth-layout/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";

const Settings = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();

  // States
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: ""
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    orderUpdates: true,
    promotions: false,
    securityAlerts: true,
    frequency: "instant",
    quietHoursEnabled: false,
    quietStart: "22:00",
    quietEnd: "07:00"
  });

  const [appearance, setAppearance] = useState({
    theme: "light",
    language: "en",
    fontSize: "medium"
  });

  // Load appearance from localStorage on component mount
  useEffect(() => {
    const savedAppearance = localStorage.getItem('appearance');
    if (savedAppearance) {
      try {
        const parsedAppearance = JSON.parse(savedAppearance);
        setAppearance(parsedAppearance);
      } catch (error) {
        console.error('Error loading appearance settings:', error);
      }
    }
  }, []);

  // Apply theme on load & on change
  useEffect(() => {
    const root = document.documentElement;
    
    if (appearance.theme === "dark") {
      root.classList.add("dark");
      root.style.setProperty('color-scheme', 'dark');
    } else {
      root.classList.remove("dark");
      root.style.setProperty('color-scheme', 'light');
    }
    
    // Save to localStorage
    localStorage.setItem('appearance', JSON.stringify(appearance));
  }, [appearance.theme]);

  // Fetch user settings
  useEffect(() => {
    fetchUserSettings();
  }, []);

  // fetchUserSettings function
  const fetchUserSettings = async () => {
    try {
      setInitialLoading(true);
    
      // Simulate API response
      const response = { data: { success: true, data: {} } };
      
      setProfileData({
        name: user?.displayName || "",
        email: user?.email || "",
        phone: user?.phoneNumber || "",
        bio: ""
      });
      setNotifications({
        emailNotifications: true,
        pushNotifications: false,
        orderUpdates: true,
        promotions: false,
        securityAlerts: true,
        frequency: "instant",
        quietHoursEnabled: false,
        quietStart: "22:00",
        quietEnd: "07:00"
      });
      
      // Don't override appearance if it's already loaded from localStorage
      const savedAppearance = localStorage.getItem('appearance');
      if (!savedAppearance) {
        setAppearance({ theme: "light", language: "en", fontSize: "medium" });
      }
    } catch (err) {
      console.error("Settings fetch error:", err);
      toast.error("Failed to load settings.");
    } finally {
      setInitialLoading(false);
    }
  };

  // Tabs
  const tabs = [
    { id: "profile", label: "Profile", icon: <FaUser className="text-lg" /> },
    { id: "security", label: "Security", icon: <FaShieldAlt className="text-lg" /> },
    { id: "notifications", label: "Notifications", icon: <FaBell className="text-lg" /> },
    { id: "appearance", label: "Appearance", icon: <FaPalette className="text-lg" /> }
  ];

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } } };
  const tabContentVariants = { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }, exit: { opacity: 0, x: -20, transition: { duration: 0.3 } } };

  // Notification Settings
  const notificationSettings = [
    {
      id: "emailNotifications",
      label: "Email Notifications",
      description: "Receive notifications via email",
      icon: <FaEnvelope className="text-blue-500" />
    },
    {
      id: "pushNotifications",
      label: "Push Notifications",
      description: "Receive push notifications in browser",
      icon: <FaBell className="text-green-500" />
    },
    {
      id: "orderUpdates",
      label: "Order Updates",
      description: "Get updates about your orders",
      icon: <FaShoppingBag className="text-purple-500" />
    },
    {
      id: "promotions",
      label: "Promotions & Offers",
      description: "Receive special offers and promotions",
      icon: <FaTag className="text-orange-500" />
    },
    {
      id: "securityAlerts",
      label: "Security Alerts",
      description: "Important security notifications",
      icon: <FaShieldAlt className="text-red-500" />
    }
  ];

  // Handlers
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosSecure.patch("/users/profile", profileData);
      if (response.data?.success) toast.success("🎉 Profile updated successfully!");
      else throw new Error(response.data?.message || "Failed to update profile");
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityUpdate = async (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }
    if (securityData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosSecure.patch("/users/security", {
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword
      });
      if (response.data?.success) {
        toast.success("🔒 Password updated successfully!");
        setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else throw new Error(response.data?.message || "Failed to update password");
    } catch (err) {
      console.error("Security update error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);
    try {
      const response = await axiosSecure.patch("/users/notifications", notifications);
      if (response.data?.success) toast.success("🔔 Notification preferences updated!");
      else throw new Error("Failed to update notifications");
    } catch (err) {
      console.error("Notification update error:", err);
      toast.error("Failed to update notification preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleAppearanceUpdate = async () => {
    setLoading(true);
    try {
      // Save to backend if needed
      const response = await axiosSecure.patch("/users/appearance", appearance);
      if (response.data?.success) {
        toast.success("🎨 Appearance settings updated!");
        
        // Apply theme immediately
        const root = document.documentElement;
        if (appearance.theme === 'dark') {
          root.classList.add('dark');
          root.style.setProperty('color-scheme', 'dark');
        } else {
          root.classList.remove('dark');
          root.style.setProperty('color-scheme', 'light');
        }
        
        // Save to localStorage
        localStorage.setItem('appearance', JSON.stringify(appearance));
      } else throw new Error("Failed to update appearance");
    } catch (err) {
      console.error("Appearance update error:", err);
      toast.error("Failed to update appearance settings");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = (settingId) => {
    setNotifications(prev => ({
      ...prev,
      [settingId]: !prev[settingId]
    }));
  };

  const handleThemeChange = (themeId) => {
    setAppearance(prev => ({ ...prev, theme: themeId }));
    // Immediate preview
    const root = document.documentElement;
    if (themeId === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('color-scheme', 'dark');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('color-scheme', 'light');
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/20 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8 flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FaUser className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Account Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and security settings</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sticky top-6">
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id 
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                ))}
              </nav>

              {/* User Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }} 
                className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-700 dark:to-gray-600/50 rounded-xl border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || user?.email}&background=6366f1&color=ffffff&bold=true`}
                    alt={user?.displayName}
                    className="w-12 h-12 rounded-xl border-2 border-white shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-white truncate">
                      {profileData.name || user?.displayName || "User"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {profileData.email || user?.email}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-600/50 px-2 py-1 rounded-lg text-center">
                  {user?.metadata?.creationTime 
                    ? `Member since ${new Date(user.metadata.creationTime).toLocaleDateString()}` 
                    : "Active user"
                  }
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <motion.div 
                  key="profile" 
                  variants={tabContentVariants} 
                  initial="hidden" 
                  animate="visible" 
                  exit="exit" 
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                    <FaUser className="text-blue-500" /> Profile Information
                  </h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                        <motion.input 
                          whileFocus={{ scale: 1.02 }} 
                          type="text" 
                          value={profileData.name} 
                          onChange={e => setProfileData({...profileData, name: e.target.value})} 
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                          placeholder="Enter your full name" 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                        <motion.input 
                          whileFocus={{ scale: 1.02 }} 
                          type="email" 
                          value={profileData.email} 
                          onChange={e => setProfileData({...profileData, email: e.target.value})} 
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                          placeholder="Enter your email" 
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                      <motion.input 
                        whileFocus={{ scale: 1.02 }} 
                        type="tel" 
                        value={profileData.phone} 
                        onChange={e => setProfileData({...profileData, phone: e.target.value})} 
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                      <motion.textarea 
                        whileFocus={{ scale: 1.02 }} 
                        value={profileData.bio} 
                        onChange={e => setProfileData({...profileData, bio: e.target.value})} 
                        rows="4" 
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none" 
                        placeholder="Tell us a little about yourself..."
                      />
                    </div>
                    <motion.button 
                      type="submit" 
                      disabled={loading} 
                      whileHover={{ scale: loading ? 1 : 1.02 }} 
                      whileTap={{ scale: 0.98 }} 
                      className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <FaSave className="text-lg"/> 
                      {loading ? "Saving Changes..." : "Update Profile"}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <motion.div 
                  key="security" 
                  variants={tabContentVariants} 
                  initial="hidden" 
                  animate="visible" 
                  exit="exit" 
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                    <FaShieldAlt className="text-blue-500" /> Security Settings
                  </h2>
                  <form onSubmit={handleSecurityUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Password *</label>
                      <div className="relative">
                        <motion.input 
                          whileFocus={{ scale: 1.02 }} 
                          type={showPassword ? "text" : "password"} 
                          value={securityData.currentPassword} 
                          onChange={e => setSecurityData({...securityData, currentPassword: e.target.value})} 
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12" 
                          placeholder="Enter current password" 
                          required
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">New Password *</label>
                      <div className="relative">
                        <motion.input 
                          whileFocus={{ scale: 1.02 }} 
                          type={showNewPassword ? "text" : "password"} 
                          value={securityData.newPassword} 
                          onChange={e => setSecurityData({...securityData, newPassword: e.target.value})} 
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12" 
                          placeholder="Enter new password" 
                          required
                        />
                        <button 
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm New Password *</label>
                      <div className="relative">
                        <motion.input 
                          whileFocus={{ scale: 1.02 }} 
                          type={showConfirmPassword ? "text" : "password"} 
                          value={securityData.confirmPassword} 
                          onChange={e => setSecurityData({...securityData, confirmPassword: e.target.value})} 
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12" 
                          placeholder="Confirm new password" 
                          required
                        />
                        <button 
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <motion.button 
                      type="submit" 
                      disabled={loading} 
                      whileHover={{ scale: loading ? 1 : 1.02 }} 
                      whileTap={{ scale: 0.98 }} 
                      className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <FaLock className="text-lg"/> 
                      {loading ? "Updating Password..." : "Update Password"}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <motion.div 
                  key="notifications" 
                  variants={tabContentVariants} 
                  initial="hidden" 
                  animate="visible" 
                  exit="exit" 
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                    <FaBell className="text-blue-500" /> Notification Preferences
                  </h2>

                  <div className="space-y-4 mb-8">
                    {notificationSettings.map((setting) => (
                      <motion.div
                        key={setting.id}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                            {setting.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white">{setting.label}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{setting.description}</p>
                          </div>
                        </div>
                        
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[setting.id]}
                            onChange={() => handleNotificationToggle(setting.id)}
                            className="sr-only peer"
                          />
                          <div className={`w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                            notifications[setting.id] ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-500'
                          }`}></div>
                        </label>
                      </motion.div>
                    ))}
                  </div>

                  {/* Notification Frequency */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Notification Frequency</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: "instant", label: "Instant", description: "Receive immediately" },
                        { id: "daily", label: "Daily Digest", description: "Once per day" },
                        { id: "weekly", label: "Weekly Summary", description: "Once per week" }
                      ].map((freq) => (
                        <motion.label
                          key={freq.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            notifications.frequency === freq.id 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          } bg-white dark:bg-gray-800`}
                        >
                          <input
                            type="radio"
                            name="frequency"
                            value={freq.id}
                            checked={notifications.frequency === freq.id}
                            onChange={(e) => setNotifications(prev => ({ ...prev, frequency: e.target.value }))}
                            className="sr-only"
                          />
                          <span className="font-semibold text-gray-800 dark:text-white">{freq.label}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">{freq.description}</span>
                        </motion.label>
                      ))}
                    </div>
                  </div>

                  {/* Quiet Hours */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quiet Hours</h3>
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Start Time</label>
                        <input
                          type="time"
                          value={notifications.quietStart}
                          onChange={(e) => setNotifications(prev => ({ ...prev, quietStart: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">End Time</label>
                        <input
                          type="time"
                          value={notifications.quietEnd}
                          onChange={(e) => setNotifications(prev => ({ ...prev, quietEnd: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center gap-3 mt-4 md:mt-6">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.quietHoursEnabled}
                            onChange={(e) => setNotifications(prev => ({ ...prev, quietHoursEnabled: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className={`w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                            notifications.quietHoursEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-500'
                          }`}></div>
                        </label>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Quiet Hours</span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleNotificationUpdate}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <FaBell className="text-lg" /> 
                    {loading ? "Updating Preferences..." : "Save Notification Settings"}
                  </motion.button>
                </motion.div>
              )}

              {/* Appearance Tab */}
              {activeTab === "appearance" && (
                <motion.div 
                  key="appearance" 
                  variants={tabContentVariants} 
                  initial="hidden" 
                  animate="visible" 
                  exit="exit" 
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                    <FaPalette className="text-blue-500" /> Appearance Settings
                  </h2>

                  {/* Theme Selection */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { 
                          id: "light", 
                          label: "Light", 
                          icon: <FaSun className="text-yellow-500 text-xl" />, 
                          description: "Clean and bright interface"
                        },
                        { 
                          id: "dark", 
                          label: "Dark", 
                          icon: <FaMoon className="text-indigo-400 text-xl" />, 
                          description: "Easy on the eyes in low light"
                        }
                      ].map((theme) => (
                        <motion.label
                          key={theme.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            appearance.theme === theme.id 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          } bg-white dark:bg-gray-800`}
                        >
                          <input
                            type="radio"
                            name="theme"
                            value={theme.id}
                            checked={appearance.theme === theme.id}
                            onChange={(e) => handleThemeChange(e.target.value)}
                            className="sr-only"
                          />
                          {theme.icon}
                          <div>
                            <span className="font-semibold text-gray-800 dark:text-white block">{theme.label}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{theme.description}</span>
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  </div>

                  {/* Language Selection */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Language</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: "en", label: "English", flag: "🇺🇸", native: "English" },
                        { id: "bn", label: "Bengali", flag: "🇧🇩", native: "বাংলা" },
                        { id: "es", label: "Spanish", flag: "🇪🇸", native: "Español" },
                        { id: "hi", label: "Hindi", flag: "🇮🇳", native: "हिन्दी" },
                        { id: "ar", label: "Arabic", flag: "🇦🇪", native: "العربية" },
                        { id: "fr", label: "French", flag: "🇫🇷", native: "Français" }
                      ].map((lang) => (
                        <motion.label
                          key={lang.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            appearance.language === lang.id 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          } bg-white dark:bg-gray-800`}
                        >
                          <input
                            type="radio"
                            name="language"
                            value={lang.id}
                            checked={appearance.language === lang.id}
                            onChange={(e) => setAppearance(prev => ({ ...prev, language: e.target.value }))}
                            className="sr-only"
                          />
                          <span className="text-2xl">{lang.flag}</span>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800 dark:text-white">{lang.label}</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{lang.native}</span>
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Font Size</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: "small", label: "Small", description: "Compact view", size: "text-sm" },
                        { id: "medium", label: "Medium", description: "Default size", size: "text-base" },
                        { id: "large", label: "Large", description: "Enhanced readability", size: "text-lg" }
                      ].map((size) => (
                        <motion.label
                          key={size.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            appearance.fontSize === size.id 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          } bg-white dark:bg-gray-800`}
                        >
                          <input
                            type="radio"
                            name="fontSize"
                            value={size.id}
                            checked={appearance.fontSize === size.id}
                            onChange={(e) => setAppearance(prev => ({ ...prev, fontSize: e.target.value }))}
                            className="sr-only"
                          />
                          <div className={`font-semibold mb-2 ${size.size} text-gray-800 dark:text-white`}>
                            Aa
                          </div>
                          <span className="font-semibold text-gray-800 dark:text-white text-center">{size.label}</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">{size.description}</span>
                        </motion.label>
                      ))}
                    </div>
                  </div>

                  {/* Real-time Preview */}
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Live Preview</h4>
                    <div className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <FaUser className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">Sample Content</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          This is how your app will look with current settings
                        </p>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleAppearanceUpdate}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl w-full justify-center"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Updating Appearance...
                      </>
                    ) : (
                      <>
                        <FaPalette className="text-lg" /> 
                        Save Appearance Settings
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;