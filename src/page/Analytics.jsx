// components/Analytics.jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, ShoppingCart, DollarSign } from "lucide-react";

const data = [
  { name: "Jan", sales: 4000, users: 2400 },
  { name: "Feb", sales: 3000, users: 1398 },
  { name: "Mar", sales: 2000, users: 9800 },
  { name: "Apr", sales: 2780, users: 3908 },
  { name: "May", sales: 1890, users: 4800 },
  { name: "Jun", sales: 2390, users: 3800 },
  { name: "Jul", sales: 3490, users: 4300 },
];

const Analytics = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
        <p className="text-gray-500">Overview of your shop performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 text-white p-4 rounded-xl flex items-center gap-4 shadow-md">
          <DollarSign className="w-8 h-8" />
          <div>
            <p className="text-sm">Revenue</p>
            <p className="text-xl font-bold">$24,300</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-400 text-white p-4 rounded-xl flex items-center gap-4 shadow-md">
          <ShoppingCart className="w-8 h-8" />
          <div>
            <p className="text-sm">Orders</p>
            <p className="text-xl font-bold">1,245</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-400 text-white p-4 rounded-xl flex items-center gap-4 shadow-md">
          <Users className="w-8 h-8" />
          <div>
            <p className="text-sm">Users</p>
            <p className="text-xl font-bold">3,450</p>
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-gray-50 p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Monthly Sales & Users</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
            <Bar dataKey="users" fill="#9333ea" name="Users" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
