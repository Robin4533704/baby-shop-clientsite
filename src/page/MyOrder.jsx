// src/page/MyOrder.jsx
import React, { useState } from "react";
import OrderTracking from "./OrderTracking";
import OrderInvoice from "./OrderInvoice";

const MyOrder = ({
  order = {},
  businessInfo = {},
  onClose,
  onContactCustomer,
  onContactBusiness,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState("details");

  // Enhanced safe access with better defaults
  const {
    id: orderId = "N/A",
    status: orderStatus = "pending",
    items: orderItems = [],
    shippingAddress = {},
    paymentMethod = "N/A",
    total: totalAmount = 0,
    paymentStatus = "pending",
    createdAt,
    estimatedDelivery,
  } = order;

  const {
    name: customerName = "N/A",
    street = "N/A",
    city = "N/A",
    state = "N/A",
    zipCode = "",
    country = "N/A",
    phone = "N/A",
    email,
  } = shippingAddress;

  // Calculate subtotal
  const subtotal = orderItems.reduce((sum, item) => {
    return sum + (item.price || 0) * (item.quantity || 0);
  }, 0);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order #{orderId}</h2>
          <div className="flex items-center gap-4 mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderStatus)}`}>
              {orderStatus.toUpperCase()}
            </span>
            {createdAt && (
              <span className="text-sm text-gray-500">
                Ordered on: {formatDate(createdAt)}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-3xl font-light transition-colors"
          aria-label="Close order details"
        >
          &times;
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: "details", label: "Order Details" },
            { id: "tracking", label: "Tracking" },
            { id: "invoice", label: "Invoice" }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Shipping Address</h4>
                <div className="text-gray-600 space-y-2">
                  <p className="font-medium">{customerName}</p>
                  <p>{street}</p>
                  <p>
                    {city}, {state} {zipCode}
                  </p>
                  <p>{country}</p>
                  <p>📞 {phone}</p>
                  {email && <p>✉️ {email}</p>}
                </div>
              </div>

              {/* Order Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Order Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">#{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">{formatDate(createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium capitalize">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`font-medium capitalize ${paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                      {paymentStatus}
                    </span>
                  </div>
                  {estimatedDelivery && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Est. Delivery:</span>
                      <span className="font-medium">{formatDate(estimatedDelivery)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Order Items */}
            <div className="space-y-6">
              <h4 className="font-semibold text-gray-900">Order Items</h4>
              <div className="space-y-3">
                {orderItems.length > 0 ? (
                  orderItems.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name || "Product"}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name || "N/A"}</p>
                          <div className="flex gap-4 mt-1">
                            {item.size && (
                              <p className="text-sm text-gray-500">Size: {item.size}</p>
                            )}
                            {item.color && (
                              <p className="text-sm text-gray-500">Color: {item.color}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Qty: {item.quantity || 0}</p>
                        <p className="font-medium text-gray-900">
                          ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          ${(item.price || 0).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No items found in this order.</p>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span>${(totalAmount - subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-semibold text-lg text-gray-900">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tracking" && (
          <OrderTracking order={order} onUpdateStatus={onUpdateStatus} />
        )}
        
        {activeTab === "invoice" && (
          <OrderInvoice order={order} businessInfo={businessInfo} />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        {onContactCustomer && (
          <button
            onClick={() => onContactCustomer(order)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Contact Customer
          </button>
        )}
        {onContactBusiness && (
          <button
            onClick={() => onContactBusiness(businessInfo)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Contact Business
          </button>
        )}
        {onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus(order)}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Update Status
          </button>
        )}
      </div>
    </div>
  );
};

export default MyOrder;