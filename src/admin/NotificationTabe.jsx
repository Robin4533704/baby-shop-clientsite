// src/components/NotificationTab.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaBell, 
  FaEnvelope, 
  FaMobile, 
  FaShoppingBag, 
  FaTag, 
  FaShieldAlt,
  FaSave,
  FaComment,
  FaCalendar,
  FaUserFriends,
  FaCog,
  FaStore,
  FaUserPlus,
  FaHeart,
  FaStar
} from "react-icons/fa";

const NotificationTab = ({ notifications, setNotifications, loading, onUpdate }) => {
  const [activeSection, setActiveSection] = useState("general");

  // All notification settings organized by categories
  const notificationCategories = [
    {
      id: "general",
      title: "General Notifications",
      icon: <FaBell className="text-blue-500" />,
      settings: [
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
          icon: <FaMobile className="text-green-500" />
        },
        {
          id: "inAppNotifications",
          label: "In-App Notifications",
          description: "Show notifications within the application",
          icon: <FaBell className="text-purple-500" />
        }
      ]
    },
    {
      id: "products",
      title: "Product & Collection",
      icon: <FaStore className="text-orange-500" />,
      settings: [
        {
          id: "newProducts",
          label: "New Product Alerts",
          description: "Get notified when new products are added",
          icon: <FaShoppingBag className="text-orange-500" />
        },
        {
          id: "productUpdates",
          label: "Product Updates",
          description: "Notifications when products are updated",
          icon: <FaCog className="text-teal-500" />
        },
        {
          id: "collectionPosts",
          label: "Collection Posts",
          description: "When someone posts in product collections",
          icon: <FaStore className="text-purple-500" />
        },
        {
          id: "priceChanges",
          label: "Price Change Alerts",
          description: "Get notified when product prices change",
          icon: <FaTag className="text-red-500" />
        },
        {
          id: "restockAlerts",
          label: "Restock Alerts",
          description: "Notifications when out-of-stock items are restocked",
          icon: <FaBell className="text-green-500" />
        },
        {
          id: "trendingProducts",
          label: "Trending Products",
          description: "Alerts for popular and trending products",
          icon: <FaStar className="text-yellow-500" />
        }
      ]
    },
    {
      id: "orders",
      title: "Order & Shopping",
      icon: <FaShoppingBag className="text-orange-500" />,
      settings: [
        {
          id: "orderUpdates",
          label: "Order Updates",
          description: "Get updates about your orders",
          icon: <FaShoppingBag className="text-orange-500" />
        },
        {
          id: "shippingUpdates",
          label: "Shipping Updates",
          description: "Track your package delivery status",
          icon: <FaCog className="text-teal-500" />
        },
        {
          id: "orderReminders",
          label: "Order Reminders",
          description: "Reminders for abandoned carts",
          icon: <FaCalendar className="text-yellow-500" />
        }
      ]
    },
    {
      id: "social",
      title: "Social & Engagement",
      icon: <FaUserFriends className="text-green-500" />,
      settings: [
        {
          id: "productLikes",
          label: "Product Likes",
          description: "When someone likes your products",
          icon: <FaHeart className="text-red-500" />
        },
        {
          id: "productComments",
          label: "Product Comments",
          description: "When someone comments on your products",
          icon: <FaComment className="text-blue-500" />
        },
        {
          id: "newFollowers",
          label: "New Followers",
          description: "When someone follows your store",
          icon: <FaUserPlus className="text-purple-500" />
        },
        {
          id: "productReviews",
          label: "Product Reviews",
          description: "Get notified about new reviews",
          icon: <FaStar className="text-yellow-500" />
        }
      ]
    },
    {
      id: "marketing",
      title: "Marketing & Promotions",
      icon: <FaTag className="text-purple-500" />,
      settings: [
        {
          id: "promotions",
          label: "Promotions & Offers",
          description: "Receive special offers and promotions",
          icon: <FaTag className="text-purple-500" />
        },
        {
          id: "newsletter",
          label: "Newsletter",
          description: "Receive our weekly newsletter",
          icon: <FaEnvelope className="text-pink-500" />
        },
        {
          id: "productRecommendations",
          label: "Product Recommendations",
          description: "Personalized product suggestions",
          icon: <FaShoppingBag className="text-indigo-500" />
        },
        {
          id: "seasonalOffers",
          label: "Seasonal Offers",
          description: "Special seasonal promotions",
          icon: <FaCalendar className="text-green-500" />
        }
      ]
    },
    {
      id: "security",
      title: "Security & Account",
      icon: <FaShieldAlt className="text-red-500" />,
      settings: [
        {
          id: "securityAlerts",
          label: "Security Alerts",
          description: "Important security notifications",
          icon: <FaShieldAlt className="text-red-500" />
        },
        {
          id: "accountActivity",
          label: "Account Activity",
          description: "Notifications about account changes",
          icon: <FaUserFriends className="text-blue-500" />
        },
        {
          id: "passwordChanges",
          label: "Password Changes",
          description: "Alerts when password is changed",
          icon: <FaShieldAlt className="text-orange-500" />
        }
      ]
    }
  ];

  const handleToggle = (settingId) => {
    setNotifications(prev => ({
      ...prev,
      [settingId]: !prev[settingId]
    }));
  };

  const handleToggleAll = (categoryId, value) => {
    const category = notificationCategories.find(cat => cat.id === categoryId);
    if (category) {
      const updatedNotifications = { ...notifications };
      category.settings.forEach(setting => {
        updatedNotifications[setting.id] = value;
      });
      setNotifications(updatedNotifications);
    }
  };

  const getCategoryToggleState = (categoryId) => {
    const category = notificationCategories.find(cat => cat.id === categoryId);
    if (!category) return 'none';
    
    const settings = category.settings;
    const enabledCount = settings.filter(setting => notifications[setting.id]).length;
    
    if (enabledCount === 0) return 'none';
    if (enabledCount === settings.length) return 'all';
    return 'some';
  };

  const handleSelectAll = () => {
    const allSettings = notificationCategories.flatMap(cat => cat.settings);
    const updatedNotifications = { ...notifications };
    allSettings.forEach(setting => {
      updatedNotifications[setting.id] = true;
    });
    setNotifications(updatedNotifications);
  };

  const handleDeselectAll = () => {
    const allSettings = notificationCategories.flatMap(cat => cat.settings);
    const updatedNotifications = { ...notifications };
    allSettings.forEach(setting => {
      updatedNotifications[setting.id] = false;
    });
    setNotifications(updatedNotifications);
  };

  // Initialize any missing notification settings
  React.useEffect(() => {
    const allSettings = notificationCategories.flatMap(cat => cat.settings);
    const updatedNotifications = { ...notifications };
    
    allSettings.forEach(setting => {
      if (updatedNotifications[setting.id] === undefined) {
        updatedNotifications[setting.id] = true; // Default to enabled
      }
    });

    // Initialize frequency if not set
    if (!updatedNotifications.frequency) {
      updatedNotifications.frequency = "instant";
    }
    
    // Initialize quiet hours if not set
    if (!updatedNotifications.quietStart) {
      updatedNotifications.quietStart = "22:00";
    }
    if (!updatedNotifications.quietEnd) {
      updatedNotifications.quietEnd = "07:00";
    }
    if (updatedNotifications.quietHoursEnabled === undefined) {
      updatedNotifications.quietHoursEnabled = false;
    }

    setNotifications(updatedNotifications);
  }, []);

  const currentCategory = notificationCategories.find(cat => cat.id === activeSection);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaBell className="text-blue-500" /> Notifications
          </h2>

          {/* Bulk Actions */}
          <div className="mb-6 space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSelectAll}
              className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
            >
              ✅ Enable All
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDeselectAll}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              ❌ Disable All
            </motion.button>
          </div>

          <nav className="space-y-1">
            {notificationCategories.map((category) => {
              const toggleState = getCategoryToggleState(category.id);
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(category.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeSection === category.id 
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg" 
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {category.icon}
                    <span className="font-medium">{category.title}</span>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    activeSection === category.id 
                      ? 'bg-white/20 text-white' 
                      : toggleState === 'all' 
                        ? 'bg-green-100 text-green-700'
                        : toggleState === 'none'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {toggleState === 'all' ? 'All' : toggleState === 'none' ? 'None' : 'Some'}
                  </div>
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {currentCategory && (
            <div>
              {/* Category Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    {currentCategory.icon}
                    {currentCategory.title}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Manage your {currentCategory.title.toLowerCase()} preferences
                  </p>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToggleAll(currentCategory.id, true)}
                    className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
                  >
                    Enable All
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToggleAll(currentCategory.id, false)}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                  >
                    Disable All
                  </motion.button>
                </div>
              </div>

              {/* Notification Settings Grid */}
              <div className="grid gap-4 mb-8">
                {currentCategory.settings.map((setting) => (
                  <motion.div
                    key={setting.id}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        {setting.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{setting.label}</h3>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[setting.id] || false}
                        onChange={() => handleToggle(setting.id)}
                        className="sr-only peer"
                      />
                      <div className={`w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                        notifications[setting.id] ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                    </label>
                  </motion.div>
                ))}
              </div>

              {/* Global Settings (only show in General section) */}
              {activeSection === "general" && (
                <div className="space-y-6">
                  {/* Notification Frequency */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Frequency</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: "instant", label: "Instant", description: "Receive immediately", icon: "⚡" },
                        { id: "daily", label: "Daily Digest", description: "Once per day", icon: "📅" },
                        { id: "weekly", label: "Weekly Summary", description: "Once per week", icon: "📊" }
                      ].map((freq) => (
                        <motion.label
                          key={freq.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            notifications.frequency === freq.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="frequency"
                            value={freq.id}
                            checked={notifications.frequency === freq.id}
                            onChange={(e) => setNotifications(prev => ({ ...prev, frequency: e.target.value }))}
                            className="sr-only"
                          />
                          <span className="text-2xl">{freq.icon}</span>
                          <div>
                            <span className="font-semibold text-gray-800 block">{freq.label}</span>
                            <span className="text-sm text-gray-600">{freq.description}</span>
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  </div>

                  {/* Quiet Hours */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quiet Hours</h3>
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                        <input
                          type="time"
                          value={notifications.quietStart}
                          onChange={(e) => setNotifications(prev => ({ ...prev, quietStart: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                        <input
                          type="time"
                          value={notifications.quietEnd}
                          onChange={(e) => setNotifications(prev => ({ ...prev, quietEnd: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center gap-3 mt-4 md:mt-6">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.quietHoursEnabled || false}
                            onChange={(e) => setNotifications(prev => ({ ...prev, quietHoursEnabled: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className={`w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                            notifications.quietHoursEnabled ? 'bg-blue-500' : 'bg-gray-300'
                          }`}></div>
                        </label>
                        <span className="text-sm font-medium text-gray-700">Enable Quiet Hours</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      During quiet hours, you won't receive any push notifications
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Save Button */}
          <motion.button
            onClick={onUpdate}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl mt-8"
          >
            <FaSave className="text-lg" /> 
            {loading ? "Updating Preferences..." : "Save All Notification Settings"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationTab;