// src/pages/User/OrderTracking.jsx
import React from "react";
import { 
  FaBox, 
  FaShippingFast, 
  FaCheckCircle, 
  FaClock,
  FaMapMarkerAlt,
  FaTruck,
  FaHome
} from "react-icons/fa";

const OrderTracking = ({ order }) => {
  // Mock tracking events - Replace with actual API data
  const trackingEvents = order.status === 'delivered' ? [
    {
      id: 1,
      status: 'ordered',
      title: 'Order Placed',
      description: 'Your order has been received',
      date: order.date,
      location: 'Online Store',
      completed: true
    },
    {
      id: 2,
      status: 'confirmed',
      title: 'Order Confirmed',
      description: 'We\'ve confirmed your order',
      date: new Date(new Date(order.date).getTime() + 30 * 60000).toISOString(), // 30 minutes later
      location: 'Warehouse',
      completed: true
    },
    {
      id: 3,
      status: 'processing',
      title: 'Processing Order',
      description: 'Your items are being prepared for shipment',
      date: new Date(new Date(order.date).getTime() + 2 * 3600000).toISOString(), // 2 hours later
      location: 'Warehouse',
      completed: true
    },
    {
      id: 4,
      status: 'shipped',
      title: 'Shipped',
      description: `Your order has been shipped via ${order.carrier}`,
      date: new Date(new Date(order.date).getTime() + 24 * 3600000).toISOString(), // 24 hours later
      location: 'Distribution Center',
      completed: true,
      trackingNumber: order.trackingNumber
    },
    {
      id: 5,
      status: 'out_for_delivery',
      title: 'Out for Delivery',
      description: 'Your order is out for delivery',
      date: new Date(new Date(order.estimatedDelivery).getTime() - 4 * 3600000).toISOString(), // 4 hours before delivery
      location: 'Local Facility',
      completed: true
    },
    {
      id: 6,
      status: 'delivered',
      title: 'Delivered',
      description: 'Your order has been delivered',
      date: order.deliveredDate,
      location: order.shippingAddress.city,
      completed: true
    }
  ] : order.status === 'shipped' ? [
    {
      id: 1,
      status: 'ordered',
      title: 'Order Placed',
      description: 'Your order has been received',
      date: order.date,
      location: 'Online Store',
      completed: true
    },
    {
      id: 2,
      status: 'confirmed',
      title: 'Order Confirmed',
      description: 'We\'ve confirmed your order',
      date: new Date(new Date(order.date).getTime() + 30 * 60000).toISOString(),
      location: 'Warehouse',
      completed: true
    },
    {
      id: 3,
      status: 'processing',
      title: 'Processing Order',
      description: 'Your items are being prepared for shipment',
      date: new Date(new Date(order.date).getTime() + 2 * 3600000).toISOString(),
      location: 'Warehouse',
      completed: true
    },
    {
      id: 4,
      status: 'shipped',
      title: 'Shipped',
      description: `Your order has been shipped via ${order.carrier}`,
      date: new Date(new Date(order.date).getTime() + 24 * 3600000).toISOString(),
      location: 'Distribution Center',
      completed: true,
      trackingNumber: order.trackingNumber,
      current: true
    },
    {
      id: 5,
      status: 'out_for_delivery',
      title: 'Out for Delivery',
      description: 'Your order will be out for delivery soon',
      date: null,
      location: 'In Transit',
      completed: false,
      estimated: order.estimatedDelivery
    },
    {
      id: 6,
      status: 'delivered',
      title: 'Delivered',
      description: 'Your order will be delivered',
      date: null,
      location: order.shippingAddress.city,
      completed: false,
      estimated: order.estimatedDelivery
    }
  ] : [
    {
      id: 1,
      status: 'ordered',
      title: 'Order Placed',
      description: 'Your order has been received',
      date: order.date,
      location: 'Online Store',
      completed: true,
      current: order.status === 'pending'
    },
    {
      id: 2,
      status: 'confirmed',
      title: 'Order Confirmed',
      description: 'We\'re confirming your order',
      date: null,
      location: 'Warehouse',
      completed: order.status === 'confirmed' || order.status === 'shipped' || order.status === 'delivered',
      current: order.status === 'confirmed'
    },
    {
      id: 3,
      status: 'processing',
      title: 'Processing Order',
      description: 'Your items will be prepared for shipment',
      date: null,
      location: 'Warehouse',
      completed: order.status === 'shipped' || order.status === 'delivered',
      current: false
    },
    {
      id: 4,
      status: 'shipped',
      title: 'Shipped',
      description: 'Your order will be shipped soon',
      date: null,
      location: 'Distribution Center',
      completed: order.status === 'delivered',
      current: false
    },
    {
      id: 5,
      status: 'out_for_delivery',
      title: 'Out for Delivery',
      description: 'Your order will be out for delivery',
      date: null,
      location: 'Local Facility',
      completed: false,
      current: false
    },
    {
      id: 6,
      status: 'delivered',
      title: 'Delivered',
      description: 'Your order will be delivered',
      date: null,
      location: order.shippingAddress.city,
      completed: false,
      current: false
    }
  ];

  const getStatusIcon = (status, completed, current) => {
    if (completed) {
      return <FaCheckCircle className="w-5 h-5 text-green-500" />;
    }
    
    if (current) {
      return <FaShippingFast className="w-5 h-5 text-blue-500 animate-pulse" />;
    }
    
    switch (status) {
      case 'ordered': return <FaBox className="w-5 h-5 text-gray-400" />;
      case 'confirmed': return <FaCheckCircle className="w-5 h-5 text-gray-400" />;
      case 'processing': return <FaClock className="w-5 h-5 text-gray-400" />;
      case 'shipped': return <FaShippingFast className="w-5 h-5 text-gray-400" />;
      case 'out_for_delivery': return <FaTruck className="w-5 h-5 text-gray-400" />;
      case 'delivered': return <FaHome className="w-5 h-5 text-gray-400" />;
      default: return <FaBox className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCarrierTrackingUrl = (carrier, trackingNumber) => {
    const carriers = {
      'FedEx': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
      'UPS': `https://www.ups.com/track?tracknum=${trackingNumber}`,
      'USPS': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
      'DHL': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`
    };
    return carriers[carrier] || '#';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Tracking Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tracking Order #{order.id}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>
                <strong>Status:</strong> 
                <span className="ml-1 capitalize font-medium text-blue-600">
                  {order.status}
                </span>
              </span>
              {order.trackingNumber && (
                <span>
                  <strong>Tracking #:</strong> 
                  <span className="ml-1 font-mono">{order.trackingNumber}</span>
                </span>
              )}
              {order.carrier && (
                <span>
                  <strong>Carrier:</strong> 
                  <span className="ml-1">{order.carrier}</span>
                </span>
              )}
            </div>
          </div>
          
          {order.trackingNumber && order.carrier && (
            <a
              href={getCarrierTrackingUrl(order.carrier, order.trackingNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 lg:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Track on {order.carrier} Website
            </a>
          )}
        </div>

        {/* Estimated Delivery */}
        {order.estimatedDelivery && (
          <div className="mt-4 p-3 bg-white rounded-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaClock className="text-blue-500" />
                <span className="font-medium text-gray-900">Estimated Delivery</span>
              </div>
              <span className="text-lg font-semibold text-blue-600">
                {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tracking Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-6">Tracking History</h4>
        
        <div className="space-y-8">
          {trackingEvents.map((event, index) => (
            <div key={event.id} className="flex">
              {/* Timeline Line */}
              <div className="flex flex-col items-center mr-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  event.completed 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : event.current
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {getStatusIcon(event.status, event.completed, event.current)}
                </div>
                
                {/* Vertical Line */}
                {index < trackingEvents.length - 1 && (
                  <div className={`flex-1 w-0.5 mt-2 ${
                    trackingEvents[index + 1].completed || trackingEvents[index + 1].current
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                  }`} />
                )}
              </div>

              {/* Event Content */}
              <div className="flex-1 pb-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <h5 className={`font-semibold ${
                      event.completed || event.current ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {event.title}
                    </h5>
                    <p className={`mt-1 ${
                      event.completed || event.current ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {event.description}
                    </p>
                    
                    {/* Tracking Number */}
                    {event.trackingNumber && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">Tracking Number: </span>
                        <span className="text-sm font-mono text-blue-600">
                          {event.trackingNumber}
                        </span>
                      </div>
                    )}

                    {/* Estimated Date */}
                    {event.estimated && !event.date && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">Estimated: </span>
                        <span className="text-sm text-yellow-600">
                          {new Date(event.estimated).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 sm:mt-0 sm:text-right">
                    <div className={`text-sm ${
                      event.completed || event.current ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {formatDate(event.date)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      <FaMapMarkerAlt className="inline w-3 h-3 mr-1" />
                      {event.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Shipping Address</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p className="font-medium">{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p className="mt-2">
              <strong>Phone:</strong> {order.shippingAddress.phone}
            </p>
          </div>
        </div>

        {/* Package Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Package Details</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Items in Package:</span>
              <span className="font-medium">
                {order.items.reduce((total, item) => total + item.quantity, 0)} items
              </span>
            </div>
            <div className="flex justify-between">
              <span>Package Weight:</span>
              <span className="font-medium">2.5 kg</span>
            </div>
            <div className="flex justify-between">
              <span>Package Dimensions:</span>
              <span className="font-medium">30 × 20 × 15 cm</span>
            </div>
            {order.carrier && (
              <div className="flex justify-between">
                <span>Shipping Service:</span>
                <span className="font-medium">{order.carrier} Express</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">Need Help with Your Order?</h4>
        <p className="text-yellow-700 text-sm mb-3">
          If you have any questions about your order or need assistance with tracking, 
          our customer service team is here to help.
        </p>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm">
            Contact Support
          </button>
          <button className="px-4 py-2 border border-yellow-600 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-sm">
            View FAQ
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;