// admin/components/RevenueStats.jsx
import React from "react";
import { FaDollarSign, FaShoppingCart, FaUsers, FaChartLine } from "react-icons/fa";

const RevenueStats = ({ stats }) => {
  const metrics = [
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue?.toLocaleString() || '0'}`,
      icon: <FaDollarSign className="text-xl" />,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      change: "+12.5%"
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders?.toLocaleString() || '0',
      icon: <FaShoppingCart className="text-xl" />,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      change: "+8.2%"
    },
    {
      title: "Avg Order Value",
      value: `$${stats?.averageOrderValue || '0'}`,
      icon: <FaChartLine className="text-xl" />,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      change: "-2.1%"
    },
    {
      title: "Conversion Rate",
      value: `${stats?.conversionRate || '0'}%`,
      icon: <FaUsers className="text-xl" />,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      change: "+4.7%"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
              <p className="text-xl font-bold text-gray-800">{metric.value}</p>
              <p className={`text-xs font-medium ${
                metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change} from last period
              </p>
            </div>
            <div className={`p-3 rounded-lg ${metric.color} text-white`}>
              {metric.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RevenueStats;