import { useState, useEffect } from 'react';
import useAxios from './../hooks/useAxios';
import Loading from '../page/Loading';

export const useProducts = (filters = {}) => {
  const axiosInstance = useAxios();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  // Fetch products
  useEffect(() => {
    if (!axiosInstance) {
      console.error('axiosInstance is not defined');
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        setError(null);

        // Build query params
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '' && value !== null) {
            queryParams.append(key, value.toString());
          }
        });

        // Include authorization token if available
        const headers = {};
        const token = localStorage.getItem('token'); // অথবা অন্য কোথাও থেকে টোকেন নিন
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const { data } = await axiosInstance.get(
          `/products?${queryParams.toString()}`,
          { headers }
        );

        setProducts(data.data || []);
        setPagination(data.pagination || {});
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch products');

        // যদি 401 এরর আসে, তাহলে ইউজার লগআউট বা রিডাইরেক্ট করুন
        if (err.response && err.response.status === 401) {
          // উদাহরণস্বরূপ, লগআউট ফাংশন কল করুন বা রিডাইরেক্ট করুন
          // logout();
        }

        setProducts([]);
        setPagination({});
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  // Fetch categories whenever products change
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosInstance.get('/categories');

        // Count products in each category
        const productsCountMap = {};
        products.forEach((p) => {
          productsCountMap[p.category] = (productsCountMap[p.category] || 0) + 1;
        });
  console.log("products", productsCountMap)
        const formattedCategories = (data.data || []).map((cat) => ({
          label: cat.label,
          value: cat.value,
          count: productsCountMap[cat.value] || 0,
        }));

        setCategories(formattedCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, [axiosInstance, products]);

  return {
    products,
    categories,
    pagination,
    error,
    loading,
  };
};