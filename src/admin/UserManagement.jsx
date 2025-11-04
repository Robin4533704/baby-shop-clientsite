import React, { useState, useEffect } from "react";
import useUserRole from "../hooks/useUserRole";
import { 
  FaUsers, 
  FaUserShield, 
  FaUser, 
  FaSearch, 
  FaSpinner, 
  FaCrown, 
  FaTrash, 
  FaExclamationTriangle,
  FaSync,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import { toast } from "react-toastify";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import UseAuth from "../auth-layout/useAuth";

const UserManagement = () => {
  const { user, loading: authLoading } = UseAuth();
  const { role: currentUserRole } = useUserRole();
  const axiosSecure = useAxiosSecure();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    if (!user) return; 

    try {
      setLoading(true);
      setError(null);

      const response = await axiosSecure.get("/users");
      const data = response.data;

      if (data?.success && Array.isArray(data?.users)) {
        setUsers(data.users);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };


 useEffect(() => {
    if (!authLoading && user && currentUserRole === "admin") {
      fetchUsers();
    }
  }, [authLoading, user, currentUserRole]);

 // Make user admin
  const makeAdmin = async (userId, userName) => {
    setActionLoading(userId);
    try {
      const response = await axiosSecure.patch(`/users/${userId}/role`, { role: "admin" });
      if (response.data?.success || response.status === 200 || response.data?.role === "admin") {
        toast.success(`✅ ${userName} is now an admin`);
        await fetchUsers();
      } else {
        throw new Error(response.data?.message || "Failed to update role");
      }
    } catch (err) {
      console.error("❌ Make admin error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update role";
      toast.error(`Failed to make admin: ${errorMessage}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Remove admin role
  const removeAdmin = async (userId, userName) => {
    setActionLoading(userId);
    try {
      const response = await axiosSecure.patch(`/users/${userId}/role`, { role: "user" });
      if (response.data?.success || response.status === 200 || response.data?.role === "user") {
        toast.success(`✅ Admin role removed from ${userName}`);
        await fetchUsers();
      } else {
        throw new Error(response.data?.message || "Failed to update role");
      }
    } catch (err) {
      console.error("❌ Remove admin error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update role";
      toast.error(`Failed to remove admin: ${errorMessage}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Delete user
  const deleteUser = async (userId, userName) => {
    const result = await Swal.fire({
      title: 'Delete User?',
      html: `Are you sure you want to delete user <strong>"${userName}"</strong>?<br><br><span class="text-red-600 font-semibold">This action cannot be undone!</span>`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Delete!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    setActionLoading(userId);
    
    try {
      const response = await axiosSecure.delete(`/users/${userId}`);
      if (response.data?.success || response.status === 200) {
        toast.success(`🗑️ User ${userName} deleted successfully`);
        await fetchUsers();
      } else {
        throw new Error(response.data?.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("❌ Delete user error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete user";
      toast.error(`Failed to delete user: ${errorMessage}`);
    } finally {
      setActionLoading(null);
    }
  };


  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get user stats
  const userStats = {
    total: users.length,
    admins: users.filter(user => user.role === 'admin').length,
    customers: users.filter(user => user.role === 'user').length,
    verified: users.filter(user => user.emailVerified).length
  };

  // Loading, error, or access denied
  if (loading) {
    return (
      <div className="min-h-96 flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
        <p className="text-slate-600">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-96 flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <FaExclamationTriangle className="text-2xl text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Error Loading Users</h3>
        <p className="text-slate-600 mb-4 max-w-md">{error}</p>
        <button
          onClick={fetchUsers}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (currentUserRole !== "admin") {
    return (
      <div className="min-h-96 flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
          <FaUserShield className="text-2xl text-amber-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Access Denied</h3>
        <p className="text-slate-600">You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FaUsers className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
              <p className="text-gray-600">
                Manage {userStats.total} user{userStats.total !== 1 ? 's' : ''} in the system
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full sm:w-64"
              />
            </div>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              <FaSync className={`${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-600">{userStats.total}</div>
            <div className="text-sm text-blue-700 font-medium">Total Users</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-600">{userStats.admins}</div>
            <div className="text-sm text-purple-700 font-medium">Admins</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-600">{userStats.customers}</div>
            <div className="text-sm text-green-700 font-medium">Customers</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-amber-600">{userStats.verified}</div>
            <div className="text-sm text-amber-700 font-medium">Verified</div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Email & Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                  {/* User Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=6366f1&color=ffffff&bold=true`}
                        alt={user.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-gray-200 shadow-sm"
                      />
                      <div>
                        <div className="font-semibold text-gray-800">
                          {user.name || "No Name"}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user._id?.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Email & Status */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-800">{user.email}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        user.emailVerified 
                          ? "bg-green-100 text-green-800" 
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {user.emailVerified ? <FaCheckCircle className="text-xs" /> : <FaTimesCircle className="text-xs" />}
                        {user.emailVerified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800 border border-purple-200"
                        : "bg-blue-100 text-blue-800 border border-blue-200"
                    }`}>
                      {user.role === "admin" ? (
                        <FaCrown className="text-purple-600" />
                      ) : (
                        <FaUser className="text-blue-600" />
                      )}
                      {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "User"}
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.createdAt || user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      {/* Make/Remove Admin Button */}
                      {user.role === "user" ? (
                        <button 
                          onClick={() => makeAdmin(user._id, user.name || user.email)}
                          disabled={actionLoading === user._id}
                          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 min-w-[120px] justify-center"
                        >
                          {actionLoading === user._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaUserShield />
                          )}
                          Make Admin
                        </button>
                      ) : (
                        <button 
                          onClick={() => removeAdmin(user._id, user.name || user.email)}
                          disabled={actionLoading === user._id}
                          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 min-w-[120px] justify-center"
                        >
                          {actionLoading === user._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaUser />
                          )}
                          Remove Admin
                        </button>
                      )}

                      {/* Delete Button */}
                      <button 
                        onClick={() => deleteUser(user._id, user.name || user.email)}
                        disabled={actionLoading === user._id}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 min-w-[100px] justify-center"
                      >
                        {actionLoading === user._id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaTrash />
                        )}
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {searchTerm ? "No users found" : "No users in the system"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm 
                ? "Try adjusting your search terms or clear the search to see all users." 
                : "There are no users registered in the system yet."
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-blue-500 hover:text-blue-600 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;