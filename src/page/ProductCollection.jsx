// src/components/ProductCollection.jsx (বা আপনার ProductCollection component)
import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import UseAuth from '../auth-layout/useAuth';

const ProductCollection = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '' });
  const { user } = UseAuth();
  const { notifyNewProduct, notifyProductUpdate, notifyProductLike } = useNotifications();

  // নতুন পণ্য যোগ করার ফাংশন
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    const productData = {
      id: Date.now().toString(),
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      createdAt: new Date().toISOString(),
      createdBy: user.displayName || user.email
    };

    // পণ্য যোগ করুন
    setProducts(prev => [productData, ...prev]);
    
    // Notification পাঠান
    notifyNewProduct(productData, user.displayName || user.email);
    
    // Form reset করুন
    setNewProduct({ name: '', description: '', price: '' });
    
    // API-তে save করুন (যদি থাকে)
    // await axiosInstance.post('/products', productData);
  };

  // পণ্য লাইক করার ফাংশন
  const handleLikeProduct = (productId) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, likes: (product.likes || 0) + 1 }
          : product
      )
    );

    const product = products.find(p => p.id === productId);
    if (product) {
      notifyProductLike(product, user.displayName || user.email);
    }
  };

  // পণ্য আপডেট করার ফাংশন
  const handleUpdateProduct = (productId, updatedData) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, ...updatedData, updatedAt: new Date().toISOString() }
          : product
      )
    );

    const product = products.find(p => p.id === productId);
    if (product) {
      notifyProductUpdate({ ...product, ...updatedData }, user.displayName || user.email);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Product Collection</h1>
      
      {/* Add Product Form */}
      <form onSubmit={handleAddProduct} className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Product
        </button>
      </form>

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-green-600 font-bold mb-4">${product.price}</p>
            <div className="flex justify-between items-center">
              <button
                onClick={() => handleLikeProduct(product.id)}
                className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                ❤️ Like ({product.likes || 0})
              </button>
              <span className="text-sm text-gray-500">
                by {product.createdBy}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCollection;