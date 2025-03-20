import { configureStore } from '@reduxjs/toolkit';
import cartsReducer from './slices/cartsSlice';
import productsReducer from './slices/productsSlice';
import { localStorageMiddleware } from './middleware/localStorageMiddleware';

// Load cart state from localStorage
const loadCartState = () => {
  try {
    const serializedState = localStorage.getItem('cartState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const cartState = loadCartState();

export const store = configureStore({
  reducer: {
    carts: cartsReducer,
    products: productsReducer,
  },
  preloadedState: {
    carts: {
      ...cartState,
      allCarts: [], // Initialize empty array for allCarts
      loading: false,
      error: null,
    }
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(localStorageMiddleware),
}); 