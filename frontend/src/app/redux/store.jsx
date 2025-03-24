import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import cartsReducer from './slices/cartsSlice';
import productsReducer from './slices/productsSlice';
import databaseReducer from './slices/databaseSlice';
import purchaseReducer from './slices/purchaseSlice';
import { localStorageMiddleware, loadState } from './middleware/localStorageMiddleware';

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    users: usersReducer,
    carts: cartsReducer,
    products: productsReducer,
    database: databaseReducer,
    purchases: purchaseReducer,
  },
  preloadedState: {
    users: persistedState?.users || { user: [] },
    carts: {
      ...(persistedState?.carts || {}),
      allCarts: [], // Initialize empty array for allCarts
      loading: false,
      error: null,
    }
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store;
