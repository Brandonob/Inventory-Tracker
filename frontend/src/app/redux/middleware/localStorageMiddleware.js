export const localStorageMiddleware = store => next => action => {
  const result = next(action);
  
  // Save the cart state after every action
  const cartState = store.getState().carts;
  localStorage.setItem('cartState', JSON.stringify({
    activeCart: cartState.activeCart,
    activeCartId: cartState.activeCartId,
    activeCartName: cartState.activeCartName
  }));
  
  return result;
}; 