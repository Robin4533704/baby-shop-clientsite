import { useState, useEffect } from 'react';
import useAxios from './../hooks/useAxios';

export const useProducts = (filters = {}) => {
  const axiosInstance = useAxios();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch Ratings
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const { data } = await axiosInstance.get('/rating');
        if (data.success && Array.isArray(data.ratings)) {
          setRatings(data.ratings);
        }
      } catch (err) {
        console.error('Error fetching ratings:', err);
      }
    };
    fetchRatings();
  }, [axiosInstance]);

  // ✅ Fetch Price Ranges
  useEffect(() => {
    const fetchPriceRanges = async () => {
      try {
        const { data } = await axiosInstance.get('/price-ranges');
        if (data.success && Array.isArray(data.data)) {
          const validRanges = data.data.filter(p => 
            p.range && p.range.length === 2
          );
          setPriceRanges(validRanges);
        }
      } catch (err) {
        console.error('Error fetching price ranges:', err);
        setPriceRanges([]);
      }
    };
    fetchPriceRanges();
  }, [axiosInstance]);

  // ✅ Fetch Products (with filters)
  useEffect(() => {
    if (!axiosInstance) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        setError(null);

        // Handle `all` category (prevent API sending `all`)
        const filterParams = { ...filters };
        if (filterParams.category === "all") delete filterParams.category;

        const queryParams = new URLSearchParams();
        Object.entries(filterParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });

        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const { data } = await axiosInstance.get(
          `/products?${queryParams.toString()}`,
          { headers }
        );

        setProducts(data.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(
          err.response?.data?.message || err.message || 'Failed to fetch products'
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, axiosInstance]);

  // ✅ Fetch Categories + Count Products
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosInstance.get('/categories');

        // Count products per category
        const productCount = {};
        products.forEach(p => {
          productCount[p.category] = (productCount[p.category] || 0) + 1;
        });

        const formatted = (data.data || []).map(cat => ({
          label: cat.label,
          value: cat.value,
          count: productCount[cat.value] || 0
        }));

        setCategories(formatted);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, [axiosInstance, products]);

  return { products, categories, priceRanges, ratings, loading, error };
};
