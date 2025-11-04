// hooks/useOrders.js
import { useState, useEffect } from 'react';
import useAxios from './useAxios';

export const useOrders = (filters = {}) => {
  const { axiosInstance, executeRequest } = useAxios();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          queryParams.append(key, value);
        }
      });

      const { data } = await executeRequest(() =>
        axiosInstance.get(`/orders?${queryParams.toString()}`)
      );

      setOrders(data.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const refetch = () => {
    fetchOrders();
  };

  return {
    orders,
    loading,
    error,
    refetch
  };
};