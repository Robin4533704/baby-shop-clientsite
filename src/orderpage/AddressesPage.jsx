// src/admin/MyAddresses.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaMapMarkerAlt, FaSave, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import useAxiosSecure from "../hooks/useAxiosSecure";
import UseAuth from "../auth-layout/useAuth";

const MyAddresses = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();

  // --- STATES ---
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(null); // null or address object
  const [formData, setFormData] = useState({
    label: "",
    addressLine: "",
    city: "",
    state: "",
    zip: "",
    country: ""
  });

  // --- FETCH ADDRESSES ---
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setInitialLoading(true);
        const res = await axiosSecure.get(`/users/${user?.email}/addresses`);
        if (res.data?.success) {
          setAddresses(res.data.addresses);
        } else {
          setAddresses([]);
        }
      } catch (err) {
        console.error("Fetch addresses error:", err);
        toast.error("Failed to load addresses.");
      } finally {
        setInitialLoading(false);
      }
    };

    if (user?.email) fetchAddresses();
  }, [user]);

  // --- HANDLE ADD/UPDATE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (editingAddress) {
        // Update address
        res = await // Fetch addresses
axiosSecure.get("/users/addresses", { params: { userEmail: user.email } });

// Add new address
axiosSecure.post("/users/addresses", {
  userEmail: user.email,
  label: "Home",
  addressLine: "123 Main St",
  city: "Dhaka",
  state: "Dhaka",
  zip: "1205",
  country: "Bangladesh"
});

      } else {
        // Add new address
        res = await axiosSecure.post(`/users/${user.email}/addresses`, formData);
        if (res.data?.success) {
          setAddresses((prev) => [...prev, res.data.address]);
          toast.success("Address added successfully!");
        }
      }
      // Reset form
      setFormData({ label: "", addressLine: "", city: "", state: "", zip: "", country: "" });
      setEditingAddress(null);
    } catch (err) {
      console.error("Save address error:", err);
      toast.error(err.response?.data?.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLE DELETE ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    setLoading(true);
    try {
      const res = await axiosSecure.delete(`/users/${user.email}/addresses/${id}`);
      if (res.data?.success) {
        setAddresses((prev) => prev.filter((addr) => addr._id !== id));
        toast.success("Address deleted successfully!");
      }
    } catch (err) {
      console.error("Delete address error:", err);
      toast.error("Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLE EDIT ---
  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country
    });
  };

  // --- LOADING SCREEN ---
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/20">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <motion.div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-blue-50/20">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaMapMarkerAlt /> My Addresses
          </h1>
          <button
            onClick={() => setEditingAddress(null)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow"
          >
            <FaPlus /> Add New
          </button>
        </div>

        {/* Address Form */}
        <AnimatePresence>
          <motion.form
            key="addressForm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow p-6 mb-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Label (Home, Office)"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="p-3 border rounded-xl w-full"
                required
              />
              <input
                type="text"
                placeholder="Address Line"
                value={formData.addressLine}
                onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                className="p-3 border rounded-xl w-full"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="p-3 border rounded-xl w-full"
                required
              />
              <input
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="p-3 border rounded-xl w-full"
                required
              />
              <input
                type="text"
                placeholder="ZIP Code"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                className="p-3 border rounded-xl w-full"
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="p-3 border rounded-xl w-full"
                required
              />
            </div>

            <div className="mt-4 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl shadow"
              >
                <FaSave /> {loading ? "Saving..." : editingAddress ? "Update Address" : "Add Address"}
              </button>
              {editingAddress && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingAddress(null);
                    setFormData({ label: "", addressLine: "", city: "", state: "", zip: "", country: "" });
                  }}
                  className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-xl shadow"
                >
                  <FaTimes /> Cancel
                </button>
              )}
            </div>
          </motion.form>
        </AnimatePresence>

        {/* Address List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <motion.div
              key={addr._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow p-6 border border-gray-200 relative"
            >
              <h3 className="font-semibold text-lg mb-2">{addr.label}</h3>
              <p className="text-gray-700">{addr.addressLine}</p>
              <p className="text-gray-700">{addr.city}, {addr.state}, {addr.zip}</p>
              <p className="text-gray-700">{addr.country}</p>

              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => handleEdit(addr)} className="text-blue-500 hover:text-blue-600">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(addr._id)} className="text-red-500 hover:text-red-600">
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MyAddresses;
