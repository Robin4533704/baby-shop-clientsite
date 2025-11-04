import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import UseAuth from "../auth-layout/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";

const MyOrders = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      toast.error("Please login to see your orders");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get(`/orders?email=${user.email}`);
        if (res.data?.success) {
          setOrders(res.data.orders);
        } else {
          const localOrders = JSON.parse(localStorage.getItem("orders") || "[]");
          const userOrders = localOrders.filter(o => o.customerInfo?.email === user.email);
          setOrders(userOrders);
        }
      } catch (err) {
        const localOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const userOrders = localOrders.filter(o => o.customerInfo?.email === user.email);
        setOrders(userOrders);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.email, axiosSecure]);

  if (loading) {
    return <div className="text-center py-10 text-lg font-semibold">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 mb-4">No orders found</p>
        <Link to="/products" className="text-blue-500 hover:underline">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-6">
      <h2 className="text-2xl font-bold mb-5">My Orders</h2>
      {orders.map((order) => (
        <div key={order.orderId || order._id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Product Info */}
          <div className="flex items-center space-x-4">
            {order.productImage && <img src={order.productImage} alt={order.productName} className="w-16 h-16 object-cover rounded-lg" />}
            <div>
              <h3 className="font-semibold text-slate-900">{order.productName}</h3>
              <p className="text-sm text-slate-500">Qty: {order.quantity}</p>
            </div>
          </div>

          {/* Price */}
          <div className="text-slate-700 font-medium">
            ৳{(order.totalAmount || order.price * order.quantity).toLocaleString()}
          </div>

          {/* Date */}
          <div className="text-sm text-slate-500">
            {new Date(order.orderDate || order.date).toLocaleDateString()}
          </div>

          {/* Status */}
          <div>
            <span
              className={`px-3 py-1 rounded-full text-white text-sm
                ${order.status === "delivered" ? "bg-green-500" 
                  : order.status === "pending" ? "bg-yellow-500" 
                  : "bg-gray-500"}`}
            >
              {order.status || "pending"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
