import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaBox,
  FaFilter,
  FaSort,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";

const ManageProducts = () => {
  const  axiosSecure  = useAxiosSecure();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/products");
      
      console.log("📦 Products Response:", res);

      if (res.data && Array.isArray(res.data.data)) {
        setProducts(res.data.data);
      } else if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        console.error("❌ Products data format unexpected:", res);
        setProducts([]);
      }
    } catch (err) {
      console.error("❌ Fetch Products Error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to load products',
        text: 'Please try again later',
        timer: 3000
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter and search products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "stock":
        return b.stock - a.stock;
      case "newest":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Get unique categories
  const categories = ["all", ...new Set(products.map(product => product.category))];

  // Delete Product
  const handleDelete = async (id, productName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `You are about to delete <strong>"${productName}"</strong>. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#fff',
      backdrop: 'rgba(0,0,0,0.8)',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });

    if (!result.isConfirmed) return;

    setActionLoading(id);
    
    try {
      const res = await axiosSecure.delete(`/products/${id}`);
      
      if (res.data.success) {
        await Swal.fire({
          title: 'Deleted!',
          text: 'Product has been deleted successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        
        fetchProducts();
      } else {
        throw new Error(res.data.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error("❌ Delete Error:", err);
      await Swal.fire({
        title: 'Error!',
        text: 'Could not delete product. Please try again.',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setActionLoading(null);
    }
  };

  // View Product Details
  const handleViewDetails = (product) => {
    Swal.fire({
      title: product.name,
      html: `
        <div class="text-left">
          <img src="${product.images?.[0] || product.image}" alt="${product.name}" 
               class="w-full h-48 object-cover rounded-lg mb-4">
          <p class="mb-2"><strong>Description:</strong> ${product.description || 'No description'}</p>
          <p class="mb-2"><strong>Price:</strong> $${product.price}</p>
          <p class="mb-2"><strong>Stock:</strong> ${product.stock} units</p>
          <p class="mb-2"><strong>Category:</strong> ${product.category}</p>
          <p class="mb-2"><strong>Status:</strong> 
            <span class="${product.stock > 0 ? 'text-green-600' : 'text-red-600'} font-semibold">
              ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </p>
          ${product.createdAt ? `<p><strong>Added:</strong> ${new Date(product.createdAt).toLocaleDateString()}</p>` : ''}
        </div>
      `,
      width: 600,
      background: '#fff',
      showCloseButton: true,
      showConfirmButton: false
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">Loading Products...</h3>
          <p className="text-gray-500 mt-2">Please wait while we fetch your products</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Product Management</h1>
              <p className="text-gray-600">
                Manage your product inventory • {products.length} products found
              </p>
            </div>
            <button
              onClick={() => window.location.href = "/dashboard/add-product"}
              className="mt-4 lg:mt-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FaBox className="text-lg" />
              Add New Product
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="relative">
              <FaSort className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="stock">Stock: High to Low</option>
              </select>
            </div>

            {/* Reset Filters */}
            <button
              onClick={resetFilters}
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
            >
              <FaTimes className="text-lg" />
              Reset Filters
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {currentProducts.length === 0 ? (
            <div className="text-center py-16">
              <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Get started by adding your first product"}
              </p>
              <button
                onClick={() => window.location.href = "/dashboard/add-product"}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentProducts.map((product) => (
                      <tr 
                        key={product._id} 
                        className="hover:bg-blue-50/30 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={product.images?.[0] || product.image || "/images/placeholder-product.jpg"}
                              alt={product.name}
                              className="h-14 w-14 rounded-xl object-cover shadow-sm border border-gray-200"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">
                            ${product.price}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`text-sm font-semibold ${
                              product.stock > 10 
                                ? "text-green-600" 
                                : product.stock > 0 
                                ? "text-yellow-600" 
                                : "text-red-600"
                            }`}>
                              {product.stock}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">units</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {product.stock > 0 ? (
                              <>
                                <FaCheckCircle className="text-green-500 mr-2" />
                                <span className="text-sm font-medium text-green-700">In Stock</span>
                              </>
                            ) : (
                              <>
                                <FaTimesCircle className="text-red-500 mr-2" />
                                <span className="text-sm font-medium text-red-700">Out of Stock</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {/* View Button */}
                            <button
                              onClick={() => handleViewDetails(product)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200"
                              title="View Details"
                            >
                              <FaEye className="text-lg" />
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => window.location.href = `/dashboard/edit-product/${product._id}`}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-all duration-200"
                              title="Edit Product"
                            >
                              <FaEdit className="text-lg" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(product._id, product.name)}
                              disabled={actionLoading === product._id}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete Product"
                            >
                              {actionLoading === product._id ? (
                                <FaSpinner className="text-lg animate-spin" />
                              ) : (
                                <FaTrash className="text-lg" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, sortedProducts.length)} of{" "}
                      {sortedProducts.length} products
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 border rounded-lg transition-colors ${
                            currentPage === page
                              ? "bg-blue-500 text-white border-blue-500"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-800">{products.length}</div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => p.stock > 0).length}
            </div>
            <div className="text-sm text-gray-600">In Stock</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-red-600">
              {products.filter(p => p.stock === 0).length}
            </div>
            <div className="text-sm text-gray-600">Out of Stock</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {categories.length - 1}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;