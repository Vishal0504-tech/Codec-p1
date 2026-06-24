import React, { createContext, useReducer, useEffect } from 'react';

// Create the Context object
export const CartContext = createContext();

// 1. Initial State: Load previous shopping cart items from local storage if they exist.
const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
};

// 2. Reducer Function: Pure function that receives previous state and an action, and returns new state.
// We use useReducer instead of useState because cart operations are complex, multi-step actions 
// (e.g. we must check if an item already exists before adding, recalculate counts, update quantities).
// A reducer centralizes all of this state manipulation logic in one clean block.
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const newItem = action.payload;
      const existItem = state.cartItems.find((item) => item._id === newItem._id);

      if (existItem) {
        // If product already exists in cart, update its quantity (qty)
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item._id === existItem._id ? { ...item, qty: Math.min(item.stock, item.qty + (newItem.qty || 1)) } : item
          ),
        };
      } else {
        // If it's a new product, append it to the cart items list
        return {
          ...state,
          cartItems: [...state.cartItems, { ...newItem, qty: newItem.qty || 1 }],
        };
      }
    }

    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        // Filter out the item matching the payload ID
        cartItems: state.cartItems.filter((item) => item._id !== action.payload),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, qty } = action.payload;
      return {
        ...state,
        // Find the product and assign the new quantity
        cartItems: state.cartItems.map((item) =>
          item._id === id ? { ...item, qty: Number(qty) } : item
        ),
      };
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        cartItems: [], // Empty the cart
      };
    }

    default:
      return state;
  }
};

// 3. Provider Component: Wraps our React app to supply state and actions to child elements.
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Sync localStorage whenever the cartItems array changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  // Action Dispatcher Helpers
  const addToCart = (product, qty = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, qty } });
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id, qty) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, qty } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
