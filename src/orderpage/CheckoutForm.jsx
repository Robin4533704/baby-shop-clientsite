import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../hooks/useAxiosSecure";


const stripePromise = loadStripe(import.meta.env.VITE_payment_key);
const CheckoutForm = ({ cartItems, user, billingInfo }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      // 1️⃣ Create PaymentIntent
      const { data } = await axiosSecure.post("/create-payment-intent", {
        amount: totalAmount * 100, // stripe expects paisa
        currency: "bdt",
      });

      const clientSecret = data.clientSecret;

      // 2️⃣ Confirm Card Payment
      const card = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card, billing_details: { name: billingInfo.name } },
      });

      if (paymentResult.error) {
        toast.error(paymentResult.error.message);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        // 3️⃣ Place order in MongoDB
        await axiosSecure.post("/order", {
          userId: user.uid,
          items: cartItems,
          paymentMethod: "Stripe",
          billingInfo,
        });
        toast.success("Payment successful & order placed!");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="border p-2 rounded mb-4" />
      <button
        type="submit"
        disabled={!stripe || loading || cartItems.length === 0}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        {loading ? "Processing..." : `Pay ৳${totalAmount}`}
      </button>
    </form>
  );
};

const CheckoutPage = ({ user }) => {
  const axiosSecure = useAxiosSecure();
  const [cartItems, setCartItems] = useState([]);
  const [billingInfo, setBillingInfo] = useState({ name: "", address: "", phone: "" });

  useEffect(() => {
    if (!user?.uid) return;
    axiosSecure.get(`/cart/${user.uid}`).then(res => {
      if (res.data.success) setCartItems(res.data.data);
    });
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {/* Billing Form */}
      <input
        type="text"
        placeholder="Name"
        value={billingInfo.name}
        onChange={(e) => setBillingInfo({ ...billingInfo, name: e.target.value })}
        className="w-full border p-2 mb-2 rounded"
      />
      <input
        type="text"
        placeholder="Address"
        value={billingInfo.address}
        onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
        className="w-full border p-2 mb-2 rounded"
      />
      <input
        type="text"
        placeholder="Phone"
        value={billingInfo.phone}
        onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
        className="w-full border p-2 mb-2 rounded"
      />

      <Elements stripe={stripePromise}>
        <CheckoutForm cartItems={cartItems} user={user} billingInfo={billingInfo} />
      </Elements>
    </div>
  );
};

export default CheckoutPage;
