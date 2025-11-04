// components/Checkout/Checkout.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Smartphone,
  Truck,
  User,
  Phone,
  MapPin,
  Home,
  Mail,
  CheckCircle,
  Shield,
  Lock,
  Package,
  Clock,
  Star,
  ShieldCheck,
  Award
} from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosSecure from "../hooks/useAxiosSecure";
import UseAuth from "../auth-layout/useAuth";

const CheckoutPage= () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
const { user} = UseAuth();
  const searchParams = new URLSearchParams(location.search);
  const quantity = parseInt(searchParams.get("quantity")) || 1;
  const [transactionId, setTransactionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [product, setProduct] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    area: "",
    shippingAddress: "",
    notes: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);

  // Fetch product data
useEffect(() => {
   if (!user) {
    toast.error("Please login first");
    navigate("/login");
    return;
  }
  setLoading(true);
 const fetchProduct = async () => {
    try {
      const res = await axiosSecure.get(`/products/${productId}`);
      
      if (res.data?.success) {
        setProduct(res.data.product);
      } else {
        toast.error("Product not found!");
      }

    } catch (error) {
      console.log("Product fetch error:", error);
      toast.error("Unable to load product details");
    } finally {
      setLoading(false);
    }
  };

  fetchProduct();
}, [productId, axiosSecure, navigate]);
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

// Update validateForm
const validateForm = () => {
  if (!customerInfo.fullName.trim()) {
    toast.error("📝 Please enter your full name");
    return false;
  }
  if (!customerInfo.phone.trim() || customerInfo.phone.length < 11) {
    toast.error("📱 Please enter a valid 11-digit phone number");
    return false;
  }
  if (customerInfo.email && !/\S+@\S+\.\S+/.test(customerInfo.email)) {
    toast.error("📧 Please enter a valid email address");
    return false;
  }
  if (!customerInfo.address.trim()) {
    toast.error("🏠 Please enter your complete address");
    return false;
  }
  if (!customerInfo.city.trim()) {
    toast.error("🏙️ Please select your city");
    return false;
  }
  if (!customerInfo.area.trim()) {
    toast.error("📍 Please enter your area/location");
    return false;
  }
  if (!agreeTerms) {
    toast.error("📄 Please agree to the terms and conditions");
    return false;
  }
  if ((paymentMethod === "bkash" || paymentMethod === "nogod") && !transactionId.trim()) {
    toast.error("💳 Please enter your transaction ID for the selected payment method");
    return false;
  }
  return true;
};

 const handlePlaceOrder = async () => {
    if (!validateForm() || !product?._id) return;

    setProcessing(true);
    try {
      const orderPayload = {
        productId: product._id,
        productName: product.name,
        productImage: product.images?.[0] || "",
        productPrice: product.price,
        quantity,
        totalAmount: product.price * quantity,
        customerInfo,
        paymentMethod,
        transactionId: transactionId || null, // এখন এটি স্টেট থেকে নিচ্ছে
        status: paymentMethod === "cash" ? "confirmed" : "pending",
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString()
      };

      const res = await axiosSecure.post("/orders", orderPayload);

      if (res.data.success) {
        toast.success("✅ Order placed successfully!");
        setOrderData(res.data.order);
        setOrderSuccess(true);
      } else {
        toast.error(res.data.message || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to place order");
    } finally {
      setProcessing(false);
    }
  };


  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    if (method !== 'cash') {
      setShowPaymentInstructions(true);
    }
  };

  // Calculate totals
  const subtotal = product ? product.price * quantity : 0;
  const shippingFee = subtotal > 1000 ? 0 : 60;
  const total = subtotal + shippingFee;

  if (loading) {
    return <CheckoutLoading />;
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.02, x: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-all duration-200 mb-6"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back to Product</span>
          </motion.button>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Secure Checkout
            </h1>
            <p className="text-slate-600 mt-2 text-lg">Complete your purchase with confidence</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column - Customer Information & Payment */}
          <div className="space-y-6">
            
            {/* Customer Information Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Customer Information</h2>
                  <p className="text-slate-600 text-sm">We'll use this to deliver your order</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      name="fullName"
                      value={customerInfo.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <span className="absolute left-10 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">+88</span>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      placeholder="1XXXXXXXXXX"
                      className="w-full border border-slate-300 rounded-xl pl-20 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City *
                  </label>
                  <select
                    name="city"
                    value={customerInfo.city}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select City</option>
                    <option value="dhaka">Dhaka</option>
                    <option value="chittagong">Chittagong</option>
                    <option value="sylhet">Sylhet</option>
                    <option value="khulna">Khulna</option>
                    <option value="rajshahi">Rajshahi</option>
                    <option value="barisal">Barisal</option>
                    <option value="rangpur">Rangpur</option>
                    <option value="mymensingh">Mymensingh</option>
                  </select>
                </div>

                {/* Area */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Area *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      name="area"
                      value={customerInfo.area}
                      onChange={handleInputChange}
                      placeholder="Your area (e.g., Mirpur, Dhanmondi)"
                      className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Full Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Complete Address *
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                    <textarea
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      placeholder="House #, Road #, Building, Floor, Flat #, Landmark..."
                      rows="3"
                      className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      required
                    />
                  </div>
                </div>

                {/* Order Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={customerInfo.notes}
                    onChange={handleInputChange}
                    placeholder="Any special delivery instructions, preferred delivery time, etc."
                    rows="2"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
              </div>
            </motion.div>

            {/* Payment Method Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Payment Method</h2>
                  <p className="text-slate-600 text-sm">Choose how you want to pay</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Cash on Delivery */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                    paymentMethod === "cash"
                      ? "border-green-500 bg-green-50 shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => handlePaymentMethodSelect("cash")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Wallet className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">Cash on Delivery</div>
                        <div className="text-sm text-slate-600">পণ্য হাতে পেয়ে টাকা দেবেন</div>
                      </div>
                    </div>
                    {paymentMethod === "cash" && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                </motion.div>

                {/* bKash */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                    paymentMethod === "bkash"
                      ? "border-pink-500 bg-pink-50 shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => handlePaymentMethodSelect("bkash")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <Smartphone className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">bKash Payment</div>
                        <div className="text-sm text-slate-600">ইন্সট্যান্ট পেমেন্ট</div>
                      </div>
                    </div>
                    {paymentMethod === "bkash" && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </div>

                  {paymentMethod === "bkash" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <h4 className="font-semibold text-slate-900 mb-2">bKash Payment Instructions:</h4>
                      <div className="text-sm text-slate-700 space-y-2">
                        <div>1. Go to your bKash Mobile Menu</div>
                        <div>2. Choose "Send Money"</div>
                        <div>3. Enter this number: <strong>01847300574</strong></div>
                        <div>4. Enter amount: <strong>৳{total.toLocaleString()}</strong></div>
                        <div>5. Enter reference: <strong>Order{Date.now().toString().slice(-6)}</strong></div>
                        <div>6. Enter your bKash PIN</div>
                        <div className="text-xs text-slate-500 mt-2">
                          Save the transaction ID for verification.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Nogod */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                    paymentMethod === "nogod"
                      ? "border-purple-500 bg-purple-50 shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => handlePaymentMethodSelect("nogod")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Smartphone className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">Nogod (নগদ)</div>
                        <div className="text-sm text-slate-600">ইন্সট্যান্ট পেমেন্ট</div>
                      </div>
                    </div>
                    {paymentMethod === "nogod" && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </div>

                  {paymentMethod === "nogod" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <h4 className="font-semibold text-slate-900 mb-2">Nogod Payment Instructions:</h4>
                      <div className="text-sm text-slate-700 space-y-2">
                        <div>1. Open your Nogod App</div>
                        <div>2. Choose "Send Money"</div>
                        <div>3. Enter this number: <strong>01969453361</strong></div>
                        <div>4. Enter amount: <strong>৳{total.toLocaleString()}</strong></div>
                        <div>5. Enter reference: <strong>Order{Date.now().toString().slice(-6)}</strong></div>
                        <div>6. Confirm with your PIN</div>
                        <div className="text-xs text-slate-500 mt-2">
                          Save the transaction ID for verification.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Terms and Conditions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6"
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                />
                <label htmlFor="agreeTerms" className="text-sm text-slate-700 leading-relaxed">
                  I agree to the <a href="/terms" className="text-blue-600 hover:underline font-medium">Terms and Conditions</a> and <a href="/privacy" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>. I understand that my personal data will be processed in accordance with the Privacy Policy and I accept the cancellation and return policy.
                </label>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            
            {/* Order Summary Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-6 sticky top-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>
              </div>

              {/* Product Details */}
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl mb-6 border border-slate-200">
                <img
                  src={product.images?.[0] || product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                    <span>Qty: {quantity}</span>
                    <span>৳{product.price?.toLocaleString()}</span>
                  </div>
                  {product.stock && (
                    <div className={`text-xs mt-1 ${
                      product.stock > 10 ? 'text-green-600' : 
                      product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {product.stock > 10 ? 'In Stock' : 
                       product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                    </div>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({quantity} items)</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping Fee</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      `৳${shippingFee}`
                    )}
                  </span>
                </div>
                
                {shippingFee === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-lg text-sm text-center"
                  >
                    🎉 Free shipping on orders over ৳1000!
                  </motion.div>
                )}
                
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-xl">৳{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Security Badges */}
              <div className="border-t border-slate-200 pt-4 mb-6">
                <div className="flex items-center justify-center space-x-6 text-slate-500">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-medium">Secure Payment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span className="text-xs font-medium">SSL Encrypted</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <motion.button
                onClick={handlePlaceOrder}
                disabled={processing || !agreeTerms}
                whileHover={processing || !agreeTerms ? {} : { scale: 1.02 }}
                whileTap={processing || !agreeTerms ? {} : { scale: 0.98 }}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                  processing || !agreeTerms
                    ? "bg-slate-400 text-slate-200 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-xl"
                }`}
              >
                {processing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Processing Your Order...</span>
                  </div>
                ) : (
                  `Place Order - ৳${total.toLocaleString()}`
                )}
              </motion.button>

              {/* Delivery Info */}
              <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-slate-600">
                <Truck className="w-4 h-4" />
                <span>Estimated delivery: 2-4 business days</span>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6"
            >
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-slate-900">10K+</div>
                  <div className="text-xs text-slate-600">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">4.8</div>
                  <div className="flex items-center justify-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="text-xs text-slate-600">Customer Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">24/7</div>
                  <div className="text-xs text-slate-600">Support</div>
                </div>
              </div>
            </motion.div>

            {/* Support Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
            >
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold text-lg mb-1">Need Help?</h3>
                <p className="text-blue-100 text-sm mb-3">We're here to assist you</p>
                <div className="space-y-1 text-sm">
                  <div>📞 Call: 017XX-XXXXXX</div>
                  <div>💬 WhatsApp: 017XX-XXXXXX</div>
                  <div>✉️ Email: support@babyshop.com</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Order Success Modal */}
      <AnimatePresence>
        {orderSuccess && orderData && (
          <OrderSuccessModal
            orderData={orderData}
            onClose={() => {
              setOrderSuccess(false);
              navigate('/dashboard/myorders');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Order Success Modal Component
const OrderSuccessModal = ({ orderData, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full mx-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed! 🎉</h2>
          <p className="text-slate-600 mb-6">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Order ID:</span>
                <span className="font-semibold text-slate-900">{orderData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Amount:</span>
                <span className="font-semibold text-slate-900">৳{orderData.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Payment Method:</span>
                <span className="font-semibold text-slate-900 capitalize">{orderData.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Estimated Delivery:</span>
                <span className="font-semibold text-slate-900">
                  {new Date(orderData.estimatedDelivery).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              Track Your Order
            </motion.button>
            <button
              onClick={() => navigate('/products')}
              className="w-full border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Loading Component
const CheckoutLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
    <div className="max-w-7xl mx-auto px-4">
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-slate-200 rounded w-48 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 h-96"></div>
            <div className="bg-white rounded-2xl p-6 h-64"></div>
          </div>
          <div className="bg-white rounded-2xl p-6 h-80"></div>
        </div>
      </div>
    </div>
  </div>
);

export default CheckoutPage;