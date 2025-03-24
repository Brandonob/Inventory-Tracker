export const localStorageMiddleware = store => next => action => {
  const result = next(action);
  
  // Save both cart and user state after every action
  const cartState = store.getState().carts;
  const userState = store.getState().users;

  localStorage.setItem('cartState', JSON.stringify({
    activeCart: cartState.activeCart,
    activeCartId: cartState.activeCartId,
    activeCartName: cartState.activeCartName
  }));

  localStorage.setItem('userState', JSON.stringify({
    user: userState.user
  }));
  
  return result;
};

// Add a function to load initial state from localStorage
export const loadState = () => {
  try {
    const cartState = localStorage.getItem('cartState');
    const userState = localStorage.getItem('userState');
    
    return {
      carts: cartState ? JSON.parse(cartState) : undefined,
      users: userState ? JSON.parse(userState) : { user: [] }
    };
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
}; 