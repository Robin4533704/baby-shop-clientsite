import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Components/Navber';
import Footer from '../Components/Footer';
import ChatBox from '../Components/ChatBox';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Minimize2 } from 'lucide-react';

const MainLayout = () => {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  
  // Pages where Navbar & Footer hidden
  const noLayoutRoutes = ["/login", "/register", "/admin", "/dashboard"];
  const hideLayout = noLayoutRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  // Pages where chat should be hidden
  const noChatRoutes = ["/admin", "/dashboard"];
  const hideChat = noChatRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  // Pages with transparent navbar
  const transparentNavbarRoutes = ["/"];
  const hasTransparentNavbar = transparentNavbarRoutes.includes(location.pathname);

  // Auto-open chat on certain pages
  useEffect(() => {
    if (location.pathname === '/products' && !hideChat) {
      const timer = setTimeout(() => {
        setIsChatOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, hideChat]);

  // Simulate new message notification
  useEffect(() => {
    if (!isChatOpen && !hideChat) {
      const messageTimer = setTimeout(() => {
        setHasNewMessage(true);
      }, 15000);
      return () => clearTimeout(messageTimer);
    }
  }, [isChatOpen, hideChat]);

  // Navbar animation variants
  const navbarVariants = {
    hidden: { 
      y: -100, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.6
      }
    }
  };

  // Main content animation variants
  const pageVariants = {
    initial: { 
      opacity: 0,
      scale: 0.98,
      y: 20
    },
    in: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.4
      }
    },
    out: { 
      opacity: 0,
      scale: 1.02,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Footer animation variants
  const footerVariants = {
    hidden: { 
      opacity: 0,
      y: 50
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  // Chat button variants
  const chatButtonVariants = {
    hidden: { 
      scale: 0,
      opacity: 0,
      rotate: -180
    },
    visible: { 
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
    setIsChatMinimized(false);
    if (hasNewMessage) setHasNewMessage(false);
  };

  const handleChatMinimize = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-25 via-white to-gray-50 flex flex-col">
      {/* Enhanced Navbar with conditional styling */}
      {!hideLayout && (
        <motion.div
          variants={navbarVariants}
          initial="hidden"
          animate="visible"
          className={`fixed top-0 left-0 right-0 z-50 ${
            hasTransparentNavbar 
              ? 'bg-transparent backdrop-blur-none' 
              : 'bg-white/80 backdrop-blur-md border-b border-gray-200/50'
          } transition-all duration-300`}
        >
          <Navbar transparent={hasTransparentNavbar} />
        </motion.div>
      )}

      {/* Main content with smooth page transitions */}
      <div className={`flex-grow ${!hideLayout ? 'pt-16' : ''}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced Footer with conditional rendering */}
      {!hideLayout && (
        <motion.div
          variants={footerVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          {/* Optional gradient overlay above footer */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          <Footer />
        </motion.div>
      )}

      {/* Chat Box Component */}
      {!hideChat && (
        <>
          {/* Chat Toggle Button */}
          <motion.button
            variants={chatButtonVariants}
            initial="hidden"
            animate={hasNewMessage ? "pulse" : "visible"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleChatToggle}
            className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
              hasNewMessage 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 ring-4 ring-green-200' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            }`}
          >
            {isChatOpen ? (
              <X size={24} className="text-white" />
            ) : (
              <MessageCircle size={24} className="text-white" />
            )}
            
            {/* Notification Badge */}
            {hasNewMessage && !isChatOpen && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping" />
            )}
            {hasNewMessage && !isChatOpen && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
            )}
          </motion.button>

          {/* Chat Box */}
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  height: isChatMinimized ? 60 : 500
                }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`fixed bottom-20 right-6 z-40 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden ${
                  isChatMinimized ? 'h-16' : 'h-[500px]'
                }`}
              >
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageCircle size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Customer Support</h3>
                      <p className="text-blue-100 text-xs">
                        {isChatMinimized ? 'Minimized' : 'We\'re here to help!'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleChatMinimize}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <Minimize2 size={16} />
                    </button>
                    <button
                      onClick={handleChatToggle}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Chat Content */}
                {!isChatMinimized && (
                  <div className="h-[408px]">
                    <ChatBox onNewMessage={() => setHasNewMessage(true)} />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Background decorative elements */}
      {!hideLayout && (
        <>
          {/* Floating background elements */}
          <div className="fixed top-1/4 left-10 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow pointer-events-none" />
          <div className="fixed top-1/3 right-10 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float pointer-events-none" />
          <div className="fixed bottom-1/4 left-1/3 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-float-slower pointer-events-none" />
        </>
      )}

      {/* Scroll progress indicator */}
      {!hideLayout && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600 z-50 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      )}
    </div>
  );
};

export default MainLayout;