// components/Orders/Orders.jsx (Updated with Enhanced WhatsApp)
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Eye,
  ShoppingBag,
  Calendar,
  User,
  Phone,
  MapPin,
  CreditCard,
  Star,
  MessageCircle,
  ArrowLeft,
  Mail,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Your business information
  const businessInfo = {
    whatsappNumber: "01969453361", // আপনার WhatsApp নাম্বার
    businessName: "BabyShop",
    supportEmail: "robinhossen4533@gmail.com"
  };

  // Enhanced WhatsApp contact functions
  const handleContactCustomer = (customerPhone, customerName = "", orderId = "") => {
    const cleanPhone = customerPhone.toString().replace(/\D/g, '');
    const message = `Hello ${customerName || 'there'}! This is ${businessInfo.businessName} regarding your order ${orderId}. How can we assist you today?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/88${cleanPhone}?text=${encodedMessage}`, '_blank');
  };

  const handleCustomerContactBusiness = (orderId = "", productName = "") => {
    const message = `Hello ${businessInfo.businessName}! I need support for Order: ${orderId} - ${productName}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/88${businessInfo.whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleQuickSupport = () => {
    const message = "Hello! I need support regarding my order/products.";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/88${businessInfo.whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  // Order status configuration
  const orderStatuses = {
    pending: { label: "Pending", color: "text-yellow-600", bgColor: "bg-yellow-100", icon: Clock },
    confirmed: { label: "Confirmed", color: "text-blue-600", bgColor: "bg-blue-100", icon: CheckCircle },
    processing: { label: "Processing", color: "text-purple-600", bgColor: "bg-purple-100", icon: RefreshCw },
    shipped: { label: "Shipped", color: "text-indigo-600", bgColor: "bg-indigo-100", icon: Truck },
    delivered: { label: "Delivered", color: "text-green-600", bgColor: "bg-green-100", icon: CheckCircle },
    cancelled: { label: "Cancelled", color: "text-red-600", bgColor: "bg-red-100", icon: XCircle }
  };

  // Load orders from localStorage
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setLoading(true);
    try {
      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const sortedOrders = savedOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setOrders(sortedOrders);
      setFilteredOrders(sortedOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders
  useEffect(() => {
    let filtered = orders;
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.phone.includes(searchTerm)
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const updatedOrders = orders.map(order =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      toast.success(`Order status updated to ${orderStatuses[newStatus].label}`);
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = orderStatuses[status];
    const IconComponent = statusConfig.icon;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
        <IconComponent className="w-4 h-4 mr-1" />
        {statusConfig.label}
      </span>
    );
  };

  if (loading) {
    return <OrdersLoading />;
  }

  return (
    <div className="min-h-screen mt-[65px] bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with WhatsApp Support */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Order Management</h1>
                <p className="text-slate-600 mt-1">Manage and track your orders</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Quick WhatsApp Support */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleQuickSupport}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors duration-200"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Quick Support</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadOrders}
                className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Orders</p>
                  <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {orders.filter(o => o.status === 'pending').length}
                  </p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Delivered</p>
                  <p className="text-2xl font-bold text-green-600">
                    {orders.filter(o => o.status === 'delivered').length}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Need Support</p>
                  <p className="text-2xl font-bold text-red-600">
                    {orders.filter(o => ['pending', 'processing'].includes(o.status)).length}
                  </p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-slate-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Status</option>
                {Object.entries(orderStatuses).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No orders found</h3>
              <p className="text-slate-600 mb-6">
                {orders.length === 0 
                  ? "You haven't received any orders yet." 
                  : "No orders match your search criteria."}
              </p>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/products')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 mr-3"
                >
                  View Products
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleQuickSupport}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200"
                >
                  Get Support on WhatsApp
                </motion.button>
              </div>
            </div>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.orderId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {order.productName}
                          </h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center space-x-1">
                            <span className="font-medium">Order ID:</span>
                            <span>{order.orderId}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{order.customerInfo.fullName}</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900 mb-1">
                          ৳{order.totalAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-600">
                          Qty: {order.quantity} × ৳{order.productPrice.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Customer Contact */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Phone className="w-4 h-4" />
                        <span>{order.customerInfo.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span className="max-w-xs truncate">
                          {order.customerInfo.area}, {order.customerInfo.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    {/* Contact Customer */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleContactCustomer(
                        order.customerInfo.phone, 
                        order.customerInfo.fullName, 
                        order.orderId
                      )}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors duration-200"
                      title="Contact Customer via WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Contact</span>
                    </motion.button>
                    
                    {/* View Details */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewOrder(order)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Details</span>
                    </motion.button>

                    {/* Support for this order */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCustomerContactBusiness(order.orderId, order.productName)}
                      className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors duration-200"
                      title="Get Support for this Order"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Support</span>
                    </motion.button>
                  </div>
                </div>

                {/* Quick Actions */}
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <div className="border-t border-slate-200 mt-4 pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-slate-600 font-medium">Update Status:</span>
                      {Object.entries(orderStatuses).map(([key, { label }]) => {
                        if (key === 'pending' || key === 'cancelled') return null;
                        return (
                          <motion.button
                            key={key}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleUpdateStatus(order.orderId, key)}
                            disabled={order.status === key}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200 ${
                              order.status === key
                                ? 'bg-blue-600 text-white cursor-not-allowed'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderDetails && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setShowOrderDetails(false)}
            onStatusUpdate={handleUpdateStatus}
            onContactCustomer={handleContactCustomer}
            onContactBusiness={handleCustomerContactBusiness}
            businessInfo={businessInfo}
          />
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={handleQuickSupport}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-2xl hover:bg-green-700 transition-colors duration-200 z-40"
        title="Quick WhatsApp Support"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

// Order Details Modal Component (Updated with WhatsApp)
const OrderDetailsModal = ({ order, onClose, onStatusUpdate, onContactCustomer, onContactBusiness, businessInfo }) => {
  const orderStatuses = {
    pending: { label: "Pending", color: "text-yellow-600", bgColor: "bg-yellow-100", icon: Clock },
    confirmed: { label: "Confirmed", color: "text-blue-600", bgColor: "bg-blue-100", icon: CheckCircle },
    processing: { label: "Processing", color: "text-purple-600", bgColor: "bg-purple-100", icon: RefreshCw },
    shipped: { label: "Shipped", color: "text-indigo-600", bgColor: "bg-indigo-100", icon: Truck },
    delivered: { label: "Delivered", color: "text-green-600", bgColor: "bg-green-100", icon: CheckCircle },
    cancelled: { label: "Cancelled", color: "text-red-600", bgColor: "bg-red-100", icon: XCircle }
  };

  const getStatusBadge = (status) => {
    const statusConfig = orderStatuses[status];
    const IconComponent = statusConfig.icon;
    return (
      <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
        <IconComponent className="w-4 h-4 mr-1" />
        {statusConfig.label}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Order Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200"
          >
            <XCircle className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Information */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-slate-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Order ID:</span>
                  <span className="font-semibold">{order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Order Date:</span>
                  <span className="font-semibold">{new Date(order.orderDate).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Payment Method:</span>
                  <span className="font-semibold capitalize">{order.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="bg-slate-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Product Details</h3>
              <div className="flex items-center space-x-4">
                <img
                  src={order.productImage}
                  alt={order.productName}
                  className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">{order.productName}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                    <span>Quantity: {order.quantity}</span>
                    <span>Price: ৳{order.productPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information & Actions */}
          <div className="space-y-6">
            {/* Customer Details */}
            <div className="bg-slate-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="font-semibold">{order.customerInfo.fullName}</div>
                    <div className="text-sm text-slate-600">Customer</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="font-semibold">{order.customerInfo.phone}</div>
                    <div className="text-sm text-slate-600">Phone</div>
                  </div>
                </div>
                {order.customerInfo.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <div>
                      <div className="font-semibold">{order.customerInfo.email}</div>
                      <div className="text-sm text-slate-600">Email</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* WhatsApp Actions */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">WhatsApp Actions</h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onContactCustomer(
                    order.customerInfo.phone,
                    order.customerInfo.fullName,
                    order.orderId
                  )}
                  className="w-full bg-white text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Contact Customer</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onContactBusiness(order.orderId, order.productName)}
                  className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Get Support for this Order</span>
                </motion.button>
              </div>
            </div>

            {/* Order Actions */}
            <div className="bg-slate-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Order Management</h3>
              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Update Order Status:
                  </label>
                  <select
                    value={order.status}
                    onChange={(e) => onStatusUpdate(order.orderId, e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(orderStatuses).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Loading Component
const OrdersLoading = () => (
  <div className="min-h-screen  bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
    <div className="max-w-7xl mx-auto px-4">
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-slate-200 rounded w-64 mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-4 h-20"></div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-6 h-20 mb-6"></div>
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 h-32"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Orders;