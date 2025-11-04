import React, { useState, useEffect } from 'react';
import { FaUsers, FaShoppingCart, FaMoneyBillWave, FaBox } from 'react-icons/fa';
import { Line, Doughnut } from 'react-chartjs-2';
import useAxiosSecure from "../hooks/useAxiosSecure";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Overview = () => {
  const axiosSecure = useAxiosSecure();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    revenueGraph: [],
    categoryData: []
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await axiosSecure.get("/stats");
      const statsData = statsRes?.data?.data || statsRes?.data || statsRes;

      setStats({
        totalUsers: statsData.totalUsers || 0,
        totalOrders: statsData.totalOrders || 0,
        totalProducts: statsData.totalProducts || 0,
        pendingOrders: statsData.pendingOrders || 0,
        totalRevenue: statsData.totalRevenue || 0,
        revenueGraph: statsData.revenueGraph || [0, 0, 0, 0, 0, 0],
        categoryData: statsData.categoryData || [0, 0, 0, 0, 0]
      });

      // ✅ if you don't have recent orders API yet, use dummy
      let ordersRes;
      try {
        ordersRes = await axiosSecure.get("/recent-orders");
      } catch {
        ordersRes = { data: [] }; 
      }

      setRecentOrders(
        Array.isArray(ordersRes?.data?.data) ? ordersRes.data.data : []
      );

    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: stats.revenueGraph,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: ["Clothes", "Toys", "Feeding", "Diapers", "Furniture"],
    datasets: [
      {
        data: stats.categoryData,
        backgroundColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)'
        ]
      }
    ]
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500 text-lg">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={<FaUsers className="text-blue-500" />} color="blue" />
        <StatCard title="Total Products" value={stats.totalProducts} icon={<FaBox className="text-purple-500" />} color="purple" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={<FaShoppingCart className="text-green-500" />} color="green" />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon={<FaShoppingCart className="text-red-500" />} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Overview">
          <Line data={revenueData} />
        </ChartCard>

        <ChartCard title="Sales by Category">
          <Doughnut data={categoryData} />
        </ChartCard>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-gray-400">No Orders Found</td></tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order._id}>
                    <td className="px-4 py-3 text-sm text-gray-900">#{order.orderId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.customerName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">${order.amount}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: "bg-blue-100 border-blue-300",
    green: "bg-green-100 border-green-300",
    purple: "bg-purple-100 border-purple-300",
    red: "bg-red-100 border-red-300"
  };

  return (
    <div className={`p-6 rounded-xl border ${colors[color]} shadow-sm`}>
      <div className="flex justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const StatusBadge = ({ status }) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

export default Overview;
