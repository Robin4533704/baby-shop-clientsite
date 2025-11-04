// src/pages/User/OrderInvoice.jsx
import React from "react";
import { FaDownload, FaPrint, FaShare } from "react-icons/fa";

const OrderInvoice = ({ order, onDownload, onPrint, onShare }) => {
  const handlePrint = () => {
    window.print();
    if (onPrint) onPrint();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice for Order #${order.id}`,
          text: `Invoice for your order from Baby Paradise`,
          url: window.location.href,
        });
        if (onShare) onShare();
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Invoice link copied to clipboard!');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 print:p-0 print:border-0">
      {/* Invoice Header */}
      <div className="flex flex-col print:flex-row print:justify-between print:items-start print:border-b print:border-gray-300 print:pb-4 print:mb-4">
        <div className="mb-6 print:mb-0">
          <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
          <p className="text-gray-600">Order #{order.id}</p>
        </div>
        
        <div className="flex space-x-2 mb-6 print:hidden">
          <button
            onClick={onDownload}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FaDownload className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FaPrint className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FaShare className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        <div className="text-right">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center print:w-24 print:h-24">
            <span className="text-white font-bold text-xl">BP</span>
          </div>
        </div>
      </div>

      {/* Company and Billing Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:grid-cols-2">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">From:</h3>
          <div className="text-gray-600 space-y-1">
            <p className="font-semibold">Baby Paradise</p>
            <p>123 Parenting Street</p>
            <p>New York, NY 10001</p>
            <p>United States</p>
            <p>contact@babyparadise.com</p>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
          <div className="text-gray-600 space-y-1">
            <p className="font-semibold">{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg print:grid-cols-4">
        <div>
          <p className="text-sm text-gray-500">Invoice Date</p>
          <p className="font-semibold">{new Date().toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Order Date</p>
          <p className="font-semibold">{new Date(order.date).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Invoice #</p>
          <p className="font-semibold">INV-{order.id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Payment Status</p>
          <p className="font-semibold capitalize text-green-600">{order.paymentStatus}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 font-semibold text-gray-900">Item</th>
              <th className="text-right py-3 font-semibold text-gray-900">Quantity</th>
              <th className="text-right py-3 font-semibold text-gray-900">Unit Price</th>
              <th className="text-right py-3 font-semibold text-gray-900">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded print:w-10 print:h-10"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <div className="text-sm text-gray-500">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span className="ml-2">Color: {item.color}</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="text-right py-4 text-gray-600">{item.quantity}</td>
                <td className="text-right py-4 text-gray-600">${item.price.toFixed(2)}</td>
                <td className="text-right py-4 font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping:</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax:</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-3 text-lg font-bold">
            <span>Total:</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg print:mt-6">
        <h4 className="font-semibold text-gray-900 mb-2">Payment Method</h4>
        <p className="text-gray-600">
          {order.paymentMethod} • Paid on {new Date(order.date).toLocaleDateString()}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm print:mt-6">
        <p>Thank you for shopping with Baby Paradise!</p>
        <p className="mt-1">
          If you have any questions about this invoice, please contact our customer service.
        </p>
        <p className="mt-2 font-medium">contact@babyparadise.com • +1 (555) 123-4567</p>
      </div>
    </div>
  );
};

export default OrderInvoice;