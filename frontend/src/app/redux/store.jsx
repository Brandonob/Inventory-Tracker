import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import cartsReducer from './slices/cartsSlice';
import productsReducer from './slices/productsSlice';
import databaseReducer from './slices/databaseSlice';
import purchaseReducer from './slices/purchaseSlice';
import themeReducer from './slices/themeSlice';
import { localStorageMiddleware, loadState } from './middleware/localStorageMiddleware';

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    users: usersReducer,
    carts: cartsReducer,
    products: productsReducer,
    database: databaseReducer,
    purchases: purchaseReducer,
    theme: themeReducer,
  },
  preloadedState: {
    users: persistedState?.users || { user: [] },
    carts: {
      ...(persistedState?.carts || {}),
      allCarts: [], // Initialize empty array for allCarts
      loading: false,
      error: null,
    },
    theme: {
      darkMode: persistedState?.theme?.darkMode || false,
    },
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store;
