export const localStorageMiddleware = store => next => action => {
  const result = next(action);
  
  // Check if we're in the browser environment
  if (typeof window === 'undefined') {
    return result;
  }
  
  try {
    // Save both cart and user state after every action
    const cartState = store.getState().carts;
    const userState = store.getState().users;
    const themeState = store.getState().theme;

    localStorage.setItem('inventoryTracker_cartState', JSON.stringify({
      activeCart: cartState.activeCart,
      activeCartId: cartState.activeCartId,
      activeCartName: cartState.activeCartName
    }));

    localStorage.setItem('inventoryTracker_userState', JSON.stringify({
      user: userState.user
    }));

    localStorage.setItem('inventoryTracker_theme', themeState.darkMode ? 'dark' : 'light');
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
  
  return result;
};

// Add a function to load initial state from localStorage
export const loadState = () => {
  try {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      return undefined;
    }
    
    const cartState = localStorage.getItem('inventoryTracker_cartState');
    const userState = localStorage.getItem('inventoryTracker_userState');
    
    return {
      carts: cartState ? JSON.parse(cartState) : undefined,
      users: userState ? JSON.parse(userState) : { user: null }
    };
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
}; 