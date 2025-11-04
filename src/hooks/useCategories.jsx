// src/hooks/useCategories.js
import { useState, useEffect } from 'react';
import useAxiosSecure from './useAxiosSecure';

// Static baby categories data
const staticBabyCategories = [
{ "id": 1, "name": "Bathing" },
  { "id": 2, "name": "Care" },
  { "id": 3, "name": "Clothing" },
  { "id": 4, "name": "Diapering" },
  { "id": 5, "name": "Feeding" },
  { "id": 6, "name": "Gear" },
  { "id": 7, "name": "Safety" },
  { "id": 8, "name": "Sleeping" },
  { "id": 9, "name": "Toys" }
];

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching categories from API...');
        
        // Try to fetch from API first
        const res = await axiosSecure.get('/categories');
        console.log('📦 API Response:', res.data);
        
        if (res.data && res.data.success) {
          setCategories(res.data.data);
          console.log(`✅ Loaded ${res.data.data.length} categories from API`);
        } else {
          // If API fails, use static data
          throw new Error('API response not successful');
        }
      } catch (err) {
        console.log('⚠️ Using static categories due to:', err.message);
        // Use static categories as fallback
        setCategories(staticBabyCategories);
        setError('Using default categories (API unavailable)');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [axiosSecure]);

  // Function to refresh categories
  const refreshCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axiosSecure.get('/categories');
      
      if (res.data && res.data.success) {
        setCategories(res.data.data);
        return { success: true, data: res.data.data };
      } else {
        setCategories(staticBabyCategories);
        return { success: true, data: staticBabyCategories, message: 'Using static categories' };
      }
    } catch (err) {
      setCategories(staticBabyCategories);
      setError('Using default categories');
      return { success: false, error: err.message, data: staticBabyCategories };
    } finally {
      setLoading(false);
    }
  };

  return { 
    categories, 
    loading, 
    error,
    refreshCategories,
    staticCategories: staticBabyCategories
  };
};

export default useCategories;