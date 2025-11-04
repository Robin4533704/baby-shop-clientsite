// components/FlashDeals.jsx
import React, { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";


const FlashDeals = () => {
  const [deals, setDeals] = useState([]);
  const [timeLeft, setTimeLeft] = useState({}); // per deal countdown
 const axiosSecure = useAxiosSecure()
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await axiosSecure.get("/products");
        if (res.data.success) {
          // ধরলাম flash deals আছে product.discount > 0
          const flashDeals = res.data.data.filter((p) => p.discount && p.discount > 0).slice(0, 6);
          setDeals(flashDeals);

          // initialize timeLeft for each deal (let’s say 1 hour from now)
          const initialTime = {};
          flashDeals.forEach((deal) => {
            const expiry = new Date();
            expiry.setHours(expiry.getHours() + 1); // 1 hour countdown
            initialTime[deal._id] = expiry;
          });
          setTimeLeft(initialTime);
        }
      } catch (err) {
        console.error("Flash deals fetch error:", err);
      }
    };

    fetchDeals();
  }, []);

  // countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const updatedTime = {};
      Object.keys(timeLeft).forEach((id) => {
        const diff = timeLeft[id] - now;
        updatedTime[id] = diff > 0 ? diff : 0;
      });
      setTimeLeft(updatedTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (deals.length === 0) return <p>No flash deals available.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Special Offers / Flash Deals</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {deals.map((deal) => (
          <div
            key={deal._id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative"
          >
            <img
              src={deal.image || "/placeholder.png"}
              alt={deal.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-3">
              <h3 className="font-medium text-lg">{deal.name}</h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-gray-800 font-semibold">
                  ${deal.price?.toFixed(2)}
                </span>
                {deal.discount && (
                  <span className="text-red-500 text-sm">
                    -{deal.discount}%
                  </span>
                )}
              </div>
              {timeLeft[deal._id] > 0 ? (
                <p className="mt-2 text-sm text-red-600 font-semibold">
                  Ends in: {formatTime(timeLeft[deal._id])}
                </p>
              ) : (
                <p className="mt-2 text-sm text-gray-500 font-semibold">Expired</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashDeals;
