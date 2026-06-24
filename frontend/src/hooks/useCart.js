import { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';

// Custom hook to consume the CartContext state directly in pages/components
const useCart = () => {
  return useContext(CartContext);
};

export default useCart;
