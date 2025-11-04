import React, { useEffect, useState } from "react";

import { toast } from "react-hot-toast";
import useAxiosSecure from "../hooks/useAxiosSecure";

const ButtonCheckoutPage = ({ user }) => {
  
  const axiosSecure = useAxiosSecure()
  const [cartItems, setCartItems] = useState([]);
  const [billing, setBilling] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  // Fetch Cart Items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axiosSecure.get(`/orders/cart/${user.uid}`);
        setCartItems(res.data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load cart items");
      }
    };
if(user?.uid){
fetchCart();
}
    
  }, [user?.uid]);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!billing.name || !billing.address || !billing.city) {
      toast.error("Please fill all required billing fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosSecure.post("/orders/checkout", {
        userId: user.uid,
        billing,
        paymentMethod,
      });

      if (res.data.success) {
        toast.success("✅ Order placed successfully!");
        setCartItems([]);
      } else {
        toast.error(res.data.message || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      toast.error("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-semibold mb-6">Checkout</h2>

      {/* Billing Form */}
      <div className="mb-6 bg-white p-4 shadow rounded">
        <h3 className="text-lg font-medium mb-4">Billing & Shipping Info</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={billing.name}
            onChange={(e) => setBilling({ ...billing, name: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={billing.email}
            onChange={(e) => setBilling({ ...billing, email: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Phone"
            value={billing.phone}
            onChange={(e) => setBilling({ ...billing, phone: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Address"
            value={billing.address}
            onChange={(e) => setBilling({ ...billing, address: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="City"
            value={billing.city}
            onChange={(e) => setBilling({ ...billing, city: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="ZIP"
            value={billing.zip}
            onChange={(e) => setBilling({ ...billing, zip: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Country"
            value={billing.country}
            onChange={(e) => setBilling({ ...billing, country: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6 bg-white p-4 shadow rounded">
        <h3 className="text-lg font-medium mb-4">Payment Method</h3>
        <div className="flex gap-4">
          {["cod", "credit", "paypal"].map((method) => (
            <label key={method} className="flex items-center gap-2">
              <input
                type="radio"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              {method.toUpperCase()}
            </label>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-6 bg-white p-4 shadow rounded">
        <h3 className="text-lg font-medium mb-4">Order Summary</h3>
        <div>
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between mb-2">
              <span>{item.productName} x {item.quantity}</span>
              <span>৳{item.productPrice * item.quantity}</span>
            </div>
          ))}
        </div>
        <hr className="my-2"/>
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>৳{totalAmount}</span>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading || cartItems.length === 0}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
};

export default ButtonCheckoutPage;
