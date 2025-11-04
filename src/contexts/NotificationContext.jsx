// src/hooks/useNotifications.js - নতুন হুক তৈরি করুন
import { useState, useEffect, useContext, createContext } from 'react';
import UseAuth from '../auth-layout/useAuth';



const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = UseAuth();


  // Load notifications from API
  const loadNotifications = async () => {
    try {
      // const response = await axiosInstance.get('/notifications');
      // setNotifications(response.data.notifications || []);
      // setUnreadCount(response.data.unreadCount || 0);
      
      // Temporary mock data
      const mockNotifications = [
        {
          id: 1,
          type: 'new_product',
          title: 'New Product Added',
          message: 'A new product has been added to BabyShop collection',
          time: '5 min ago',
          read: false,
          icon: '🛍️',
          productId: '123'
        }
      ];
      setNotifications(mockNotifications);
      setUnreadCount(1);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  // Add new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Save to API
    // axiosInstance.post('/notifications', newNotification).catch(console.error);
  };

  // Mark as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Update in API
    // axiosInstance.patch(`/notifications/${notificationId}`, { read: true }).catch(console.error);
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
    
    // Update in API
    // axiosInstance.patch('/notifications/mark-all-read').catch(console.error);
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    
    // Delete from API
    // axiosInstance.delete('/notifications').catch(console.error);
  };

  // Product collection specific notifications
  const notifyNewProduct = (productData, postedBy) => {
    addNotification({
      type: 'collection_post',
      title: 'New Product in Collection',
      message: `${postedBy} added a new product: ${productData.name}`,
      productId: productData.id,
      postedBy: postedBy,
      icon: '🛍️'
    });
  };

  const notifyProductUpdate = (productData, updatedBy) => {
    addNotification({
      type: 'product_update',
      title: 'Product Updated',
      message: `${updatedBy} updated product: ${productData.name}`,
      productId: productData.id,
      updatedBy: updatedBy,
      icon: '✏️'
    });
  };

  const notifyProductLike = (productData, likedBy) => {
    addNotification({
      type: 'product_like',
      title: 'Product Liked',
      message: `${likedBy} liked your product: ${productData.name}`,
      productId: productData.id,
      likedBy: likedBy,
      icon: '❤️'
    });
  };

  const notifyProductComment = (productData, commentedBy) => {
    addNotification({
      type: 'product_comment',
      title: 'New Comment',
      message: `${commentedBy} commented on your product: ${productData.name}`,
      productId: productData.id,
      commentedBy: commentedBy,
      icon: '💬'
    });
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    notifyNewProduct,
    notifyProductUpdate,
    notifyProductLike,
    notifyProductComment,
    loadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};