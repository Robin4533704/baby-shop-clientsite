import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  Home,
  Package,
  Info,
  Phone,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Shield,
  BarChart3,
  ShoppingBag,
  Layers,
  BookOpen,
  Search,
  Star,
  Baby,
  Truck
} from "lucide-react";

import useUserRole from "../hooks/useUserRole";
import UseAuth from "../auth-layout/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";

const ProfileDropdown = ({ user, role, onLogout }) => {
  const [open, setOpen] = useState(false);

  const getInitial = () =>
    user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm"
      >
        {/* User Image or Initials */}
        <div className="w-8 h-8 rounded-full overflow-hidden shadow-lg">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {getInitial()}
            </div>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100/50 overflow-hidden z-50"
          >
            {/* User Info */}
            <div className="p-4 border-b border-gray-100/50 flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                    {getInitial()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {user.displayName || "User"}
                </p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                    role === "admin"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {role === "admin" ? "👑 Admin" : "👤 Customer"}
                </span>
              </div>
            </div>

            {/* Links */}
            <div className="p-2">
              <Link
                to="/dashboard"
                className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all duration-200"
                onClick={() => setOpen(false)}
              >
                {role === "admin" ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                <span>Dashboard</span>
              </Link>

              {role === "admin" && (
                <Link
                  to="/dashboard/analytics"
                  className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
                  onClick={() => setOpen(false)}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </Link>
              )}

              <Link
                to="/dashboard/setting"
                className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                onClick={() => setOpen(false)}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </div>

            {/* Logout */}
            <div className="p-2 border-t border-gray-100/50">
              <button
                onClick={onLogout}
                className="flex items-center space-x-3 px-3 py-2.5 text-red-600 hover:bg-red-50 w-full rounded-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Notification Item Component
const NotificationItem = ({ notification, index, onClick }) => {
  const variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { delay: index * 0.1, duration: 0.3 } },
  };

  return (
    <motion.div
      key={notification.id}
      initial="hidden"
      animate="visible"
      variants={variants}
      onClick={() => onClick(notification.id, notification.actionUrl)}
      className={`flex items-start space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group ${
        notification.read ? "bg-transparent hover:bg-gray-50" : "bg-purple-50/50 hover:bg-purple-100/50"
      }`}
    >
      <div className="flex-shrink-0 mt-1">{notification.icon}</div>
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm ${notification.read ? "text-gray-700" : "text-gray-900"}`}>
          {notification.title}
        </p>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
      </div>
      {!notification.read && <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>}
    </motion.div>
  );
};
// Cart Icon with Badge
const CartIcon = () => {
  const [itemCount, setItemCount] = useState(3); // Mock data
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link
        to="/cartbutton"
        className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
      >
        <ShoppingCart className="w-5 h-5 relative z-10" />
        
        {/* Hover Effect */}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </Link>

      {/* Cart Badge */}
      {itemCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
        >
          {itemCount}
        </motion.span>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap z-50"
          >
            View Cart ({itemCount} items)
            <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Wishlist Icon with Badge
const WishlistIcon = () => {
  const [wishlistCount, setWishlistCount] = useState(2); // Mock data
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleClick = () => {
    setIsLiked(!isLiked);
    setWishlistCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.button
        onClick={handleClick}
        className={`flex items-center justify-center w-10 h-10 rounded-xl shadow-lg transition-all duration-300 relative overflow-hidden group ${
          isLiked 
            ? 'bg-red-500 text-white' 
            : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500 border border-gray-200'
        }`}
        whileHover={{ 
          backgroundColor: isLiked ? "#dc2626" : "#fef2f2",
          color: isLiked ? "#ffffff" : "#dc2626"
        }}
      >
        <motion.div
          animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Heart className="w-5 h-5 relative z-10" fill={isLiked ? "currentColor" : "none"} />
        </motion.div>
        
        {/* Hover Effect */}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.button>

      {/* Wishlist Badge */}
      {wishlistCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
        >
          {wishlistCount}
        </motion.span>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap z-50"
          >
            {isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
            <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Search Bar Component
const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div className="relative">

      {/* Search Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Navbar Component
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logOut } = UseAuth();
  const { role } = useUserRole();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mock notifications
  useEffect(() => {
    if (user) {
      setNotifications([
        { 
          id: 1, 
          title: "New Arrival!", 
          message: "Check out our new baby clothing collection", 
          time: "5 min ago", 
          read: false, 
          icon: <ShoppingBag className="w-4 h-4 text-green-500" />, 
          actionUrl: "/products?new=true" 
        },
        { 
          id: 2, 
          title: "Special Offer", 
          message: "Get 20% off on baby care products", 
          time: "1 hour ago", 
          read: false, 
          icon: <Star className="w-4 h-4 text-yellow-500" />, 
          actionUrl: "/products?special=true" 
        },
      ]);
    }
  }, [user]);

  const menuItems = [
    { path: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { path: "/products", label: "Shop", icon: <Package className="w-4 h-4" /> },
    { path: "/categories", label: "Categories", icon: <Layers className="w-4 h-4" /> },
    { path: "/blog", label: "Blog", icon: <BookOpen className="w-4 h-4" /> },
    { path: "/about", label: "About", icon: <Info className="w-4 h-4" /> },
    { path: "/contact", label: "Contact", icon: <Phone className="w-4 h-4" /> },
  ];


  const isActive = (path) => location.pathname === path;

  const handleNotificationClick = (id, url) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    if (url) navigate(url);
    setNotifOpen(false);
  };

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const clearAllNotif = () => setNotifications([]);

  const handleLogout = async () => {
    await logOut();
    navigate("/")
  };

  const getInitial = () => user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Truck size={14} />
              <span>Free Delivery Over ৳1000</span>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Star size={14} />
              <span>Premium Baby Products</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Phone size={14} />
              <span>+88 01969453361</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`sticky top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-100/50" 
            : "bg-white/90 backdrop-blur-lg border-b border-gray-100/30"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Baby className="text-white" size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  BabyBliss
                </span>
                <span className="text-xs text-gray-500 -mt-1 font-medium tracking-wide">Premium Baby Care</span>
              </div>
            </Link>

      
           

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2.5 font-medium rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? "text-white bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg"
                      : "text-gray-700 hover:text-pink-600 hover:bg-pink-50/50"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Desktop Action Icons */}
            <div className="hidden lg:flex items-center space-x-3">
              <SearchBar />
              <WishlistIcon />
              <CartIcon />
              
              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-gray-600 rounded-xl shadow-lg hover:shadow-xl hover:border-purple-300 hover:text-purple-600 transition-all duration-300 relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute right-0 top-full mt-2 w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100/50 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-gray-100/50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                              Mark all read
                            </button>
                          )}
                          <button onClick={clearAllNotif} className="text-sm text-gray-500 hover:text-red-600 font-medium">
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((n, i) => (
                            <NotificationItem key={n.id} notification={n} index={i} onClick={handleNotificationClick} />
                          ))
                        ) : (
                          <div className="p-8 text-center">
                            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">No notifications yet</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile */}
              {user ? (
                <ProfileDropdown user={user} role={role} onLogout={handleLogout} />
              ) : (
                <Link 
                  to="/login" 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="lg:hidden flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-gray-600 rounded-xl shadow-lg hover:shadow-xl hover:border-pink-300 hover:text-pink-600 transition-all duration-300"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100/50 overflow-hidden shadow-2xl"
            >
              <div className="px-2 pt-2 pb-4 space-y-1">
               
                {/* Menu Items */}
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}

                {/* Mobile Action Icons */}
                <div className="flex items-center justify-around px-4 py-3 border-t border-gray-100">
                  <SearchBar />
                  <WishlistIcon />
                  <CartIcon />
                </div>

                {/* Mobile Profile */}
                {user && (
                  <div className="mt-2 border-t border-gray-100 pt-3">
                    <motion.button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {getInitial()}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-semibold text-gray-800 truncate">{user.displayName || "User"}</span>
                          <span className="text-sm text-gray-500 truncate">{user.email}</span>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                    </motion.button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="mt-2 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                        >
                          <Link
                            to="/dashboard"
                            className="flex items-center space-x-3 px-3 py-2 rounded-xl text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all duration-200"
                            onClick={() => setMenuOpen(false)}
                          >
                            {role === "admin" ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            <span>Dashboard</span>
                          </Link>

                          {role === "admin" && (
                            <Link
                              to="/dashboard/analytics"
                              className="flex items-center space-x-3 px-3 py-2 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
                              onClick={() => setMenuOpen(false)}
                            >
                              <BarChart3 className="w-4 h-4" />
                              <span>Analytics</span>
                            </Link>
                          )}

                          <Link
                            to="/dashboard/setting"
                            className="flex items-center space-x-3 px-3 py-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                            onClick={() => setMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </Link>

                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 w-full rounded-xl transition-all duration-200"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {!user && (
                  <div className="px-4 pt-3 border-t border-gray-100">
                    <Link
                      to="/login"
                      className="block w-full text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => setMenuOpen(false)}
                    >
                      Login / Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;