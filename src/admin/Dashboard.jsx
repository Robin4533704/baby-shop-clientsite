// admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaSearchLocation,
  FaUsers,
  FaProductHunt,
  FaHeart,
  FaUser,
  FaChartLine,
  FaTimes,
  FaBars,
  FaShoppingCart,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaCog,
  FaStore,
  FaChartBar,
  FaClipboardList,
  FaUserShield,
  FaSignOutAlt,
  FaBaby,
  FaShieldAlt,
  FaShoppingBag,
  FaTachometerAlt,
  FaCubes,
  FaUserCircle,
  FaAddressBook,
  FaBell,
  FaCrown
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useUserRole from "../hooks/useUserRole";
import UseAuth from "../auth-layout/useAuth";

const Dashboard = () => {
  const { role, error: roleError } = useUserRole();
  const { user, logOut } = UseAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activePath, setActivePath] = useState("");
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close drawer on route change (mobile only)
  useEffect(() => {
    if (isMobile) setDrawerOpen(false);
    setActivePath(location.pathname);
  }, [location, isMobile]);

  // Sample notifications
  useEffect(() => {
    setNotifications([
      { id: 1, message: "New order received", type: "order", read: false },
      { id: 2, message: "Product low in stock", type: "stock", read: true },
      { id: 3, message: "Customer review posted", type: "review", read: false }
    ]);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Error state
  if (roleError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-2xl shadow-xl border border-pink-100 max-w-md"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimes className="text-3xl text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">We couldn't load your dashboard. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Refresh Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  const finalRole = role || "user";

  // Link styling function
  const getLinkClass = (isActive) =>
    `flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 font-medium group relative overflow-hidden ${
      isActive
        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-2xl shadow-pink-500/30 transform scale-[1.02]"
        : "text-gray-700 hover:bg-white/90 hover:text-pink-600 hover:shadow-lg hover:translate-x-2 border border-transparent hover:border-pink-100"
    }`;

  // Dashboard menu configuration
  const userMenu = [
    { 
      id: "overview", 
      name: "My Dashboard", 
      icon: <FaTachometerAlt className="text-lg" />, 
      path: "/dashboard", 
      description: "Personal overview",
      badge: "New"
    },
    { 
      id: "orders", 
      name: "My Orders", 
      icon: <FaShoppingBag className="text-lg" />, 
      path: "/dashboard/myorders", 
      description: "Order history & status",
      badge: "3"
    },
    { 
      id: "wishlist", 
      name: "My Wishlist", 
      icon: <FaHeart className="text-lg" />, 
      path: "/dashboard/wishlist", 
      description: "Saved items",
      badge: "12"
    },
    { 
      id: "addresses", 
      name: "My Addresses", 
      icon: <FaAddressBook className="text-lg" />, 
      path: "/dashboard/myaddresses", 
      description: "Shipping addresses" 
    },
    { 
      id: "tracking", 
      name: "Track Order", 
      icon: <FaSearchLocation className="text-lg" />, 
      path: "#", 
      description: "Order tracking" 
    },
    { 
      id: "profile", 
      name: "My Profile", 
      icon: <FaUserCircle className="text-lg" />, 
      path: "/dashboard/profile", 
      description: "Personal information" 
    },
  ];

  const adminMenu = [
    { 
      id: "overview", 
      name: "Dashboard", 
      icon: <FaChartBar className="text-lg" />, 
      path: "/dashboard/overview", 
      description: "Business analytics",
      badge: "Live"
    },
    { 
      id: "products", 
      name: "Manage Products", 
      icon: <FaCubes className="text-lg" />, 
      path: "/dashboard/Products-manaz", 
      description: "Manage inventory",
      badge: "24"
    },
    { 
      id: "add-product", 
      name: "Add Product", 
      icon: <FaStore className="text-lg" />, 
      path: "/dashboard/add-product", 
      description: "Add new product" 
    },
    { 
      id: "orders", 
      name: "Order Management", 
      icon: <FaClipboardList className="text-lg" />, 
      path: "/dashboard/orders", 
      description: "Manage orders",
      badge: "5"
    },
    { 
      id: "users", 
      name: "Customer Management", 
      icon: <FaUserShield className="text-lg" />, 
      path: "/dashboard/users", 
      description: "Customer management" 
    },
    { 
      id: "revenue", 
      name: "Revenue Analytics", 
      icon: <FaMoneyBillWave className="text-lg" />, 
      path: "/dashboard/revenue", 
      description: "Sales reports" 
    },
    { 
      id: "categories", 
      name: "Categories", 
      icon: <FaBox className="text-lg" />, 
      path: "#", 
      description: "Manage categories" 
    },
  ];

  const menuItems = finalRole === "admin" ? adminMenu : userMenu;

  // Get page title based on current path
  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === activePath);
    if (currentItem) return currentItem.name;
    
    if (activePath === "/dashboard") {
      return finalRole === "admin" ? "Admin Overview" : "My Dashboard";
    }
    
    return "Dashboard";
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Menu Item Component to fix the isActive issue
  const MenuItem = ({ item, index }) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <NavLink 
        to={item.path} 
        className={({ isActive }) => getLinkClass(isActive)}
      >
        {item.icon}
        <div className="flex-1">
          <div className="font-semibold flex items-center gap-2">
            {item.name}
            {item.badge && (
              <NavLink 
                to={item.path}
                className={({ isActive }) => 
                  `text-xs px-2 py-0.5 rounded-full ${
                    isActive 
                      ? "bg-white/30 text-white" 
                      : "bg-pink-500 text-white"
                  }`
                }
              >
                {item.badge}
              </NavLink>
            )}
          </div>
          <div className="text-xs opacity-70 mt-1">{item.description}</div>
        </div>
        <motion.div
          whileHover={{ scale: 1.2 }}
          className="w-2 h-2 bg-current opacity-0 group-hover:opacity-30 rounded-full transition-opacity"
        />
      </NavLink>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-6 left-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="w-14 h-14 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 flex items-center justify-center text-gray-700 hover:text-pink-600 transition-all duration-300 hover:shadow-2xl"
        >
          {drawerOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </motion.button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {drawerOpen && isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
          )}
        </AnimatePresence>

        <motion.aside
          initial={false}
          animate={{ 
            x: drawerOpen || !isMobile ? 0 : -320 
          }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            w-80 min-h-screen transform
            bg-white/95 backdrop-blur-xl shadow-2xl border-r border-white/60
            flex flex-col
          `}
        >
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200/60 bg-gradient-to-r from-white to-pink-50/50">
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-14 h-14 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500"
              >
                <FaBaby className="text-2xl text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  BabyShop
                </h1>
                <p className="text-xs text-gray-500 -mt-1 font-medium">Premium Baby Care</p>
              </div>
            </Link>
            
            {/* User Info & Role Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 space-y-3"
            >
              <div className="flex items-center gap-3 p-3 bg-white/80 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user?.displayName || 'Welcome Back!'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'User Account'}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
                  finalRole === "admin" 
                    ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg" 
                    : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                }`}>
                  {finalRole === "admin" ? <FaCrown className="text-xs" /> : <FaUser className="text-xs" />}
                  {finalRole === "admin" ? "Administrator" : "Premium Member"}
                </span>
                
                {finalRole === "admin" && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg font-medium">
                    👑 Admin Mode
                  </span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto space-y-2">
            {/* Dashboard Home */}
            <NavLink 
              to="/dashboard" 
              end 
              className={({ isActive }) => getLinkClass(isActive)}
            >
              <FaHome className="text-xl" />
              <div className="flex-1">
                <div className="font-semibold">Dashboard Home</div>
                <div className="text-xs opacity-80 mt-1">
                  {finalRole === "admin" ? "Store Overview" : "Personal Overview"}
                </div>
              </div>
              <div className="w-2 h-2 bg-white/30 rounded-full"></div>
            </NavLink>

            {/* Role-Based Menu */}
            {menuItems.map((item, index) => (
              <MenuItem key={item.id} item={item} index={index} />
            ))}

            {/* Settings (Common for all) */}
            <NavLink 
              to="/dashboard/settings" 
              className={({ isActive }) => getLinkClass(isActive)}
            >
              <FaCog className="text-xl" />
              <div className="flex-1">
                <div className="font-semibold">Settings</div>
                <div className="text-xs opacity-70 mt-1">Account preferences</div>
              </div>
            </NavLink>
          </nav>

          {/* Footer Section */}
          <div className="p-4 border-t border-gray-200/60 bg-gradient-to-t from-white to-gray-50/50 space-y-2">
            {/* Notifications */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50/50 border border-blue-100">
              <div className="relative">
                <FaBell className="text-blue-500 text-lg" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-800">Notifications</div>
                <div className="text-xs text-gray-600">{unreadNotifications} unread</div>
              </div>
            </div>

            {/* Back to Main Site */}
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-white hover:text-gray-800 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-200"
            >
              <FaHome className="text-lg" />
              <span className="font-semibold">Back to Store</span>
            </Link>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 w-full transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <FaSignOutAlt className="text-lg group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-semibold">Sign Out</span>
            </motion.button>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 lg:ml-0">
          {/* Content Header */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-20 shadow-sm"
          >
            <div className="px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {getPageTitle()}
                  </h1>
                  <p className="text-gray-600 text-lg mt-2">
                    {finalRole === "admin" 
                      ? "Manage your baby store and track performance" 
                      : "Welcome to your personal baby care dashboard"
                    }
                  </p>
                </div>
                
                {/* Quick Stats/Info */}
                <div className="flex items-center gap-4">
                  {finalRole === "admin" && (
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Store Status</div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-gray-700">Live</span>
                      </div>
                    </div>
                  )}
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                    {user?.displayName?.charAt(0) || 'U'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Page Content */}
          <div className="min-h-screen p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;