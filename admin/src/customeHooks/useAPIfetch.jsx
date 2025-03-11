import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Fetch products
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.get('https://fakestoreapi.com/products');
    //   console.log(data)
      return data;
    },
  });
};

// Fetch users
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axios.get('https://fakestoreapi.com/users');
      return data;
    },
  });
};

// Fetch carts
export const useCarts = () => {
  return useQuery({
    queryKey: ['carts'],
    queryFn: async () => {
      const { data } = await axios.get('https://fakestoreapi.com/carts');
      return data;
    },
  });
};
