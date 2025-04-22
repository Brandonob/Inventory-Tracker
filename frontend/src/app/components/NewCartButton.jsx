'use client';
import { IconButton, useToast } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  clearActiveCartProducts, 
  setActiveCartId, 
  setActiveCartName,
  hasCartChanges
} from '../redux/slices/cartsSlice';
import { BsCartX } from "react-icons/bs";

export function NewCartButton() {
  const dispatch = useDispatch();
  const toast = useToast();
  const activeCartId = useSelector(state => state.carts.activeCartId);
  const activeCart = useSelector(state => state.carts.activeCart);
  const allCarts = useSelector(state => state.carts.allCarts);

  const handleNewCart = async () => {
    // If there's no active cart, just return
    if (!activeCart?.products?.length) {
      toast({
        title: 'Cart is already empty',
        status: 'info',
        duration: 3000,
      });
      return;
    }

    // If there's an active cart ID, it means it's a saved cart
    if (activeCartId) {
      const savedCart = allCarts.find(cart => cart._id === activeCartId);
      
      // Check if there are changes to the cart
      if (hasCartChanges(activeCart, savedCart)) {
        toast({
          title: 'Unsaved Changes',
          description: 'Please save your changes before creating a new cart',
          status: 'warning',
          duration: 3000,
        });
        return;
      }

      // Update isActiveCart to false in database
      try {
        const response = await fetch(`/api/carts/${activeCartId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isActiveCart: false }),
        });

        if (!response.ok) {
          throw new Error('Failed to update cart status');
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to update cart status',
          status: 'error',
          duration: 3000,
        });
        return;
      }
    }

    // Clear the active cart state
    dispatch(clearActiveCartProducts());
    dispatch(setActiveCartId(null));
    dispatch(setActiveCartName(''));

    toast({
      title: 'Cart Cleared',
      description: 'You can now start a new cart',
      status: 'success',
      duration: 3000,
    });
  };

  return (
    <IconButton
      onClick={handleNewCart}
      height='45px'
      width='45px'
      borderRadius='50%'
      bg='rgb(90 103 250)'
      _hover={{ 
        bg: 'rgb(25,36,173,0.3)',
        boxShadow: '0 0 0 6px rgba(255,255,255,1)'
      }}
      margin='15px 30px'
      position='relative'
      zIndex={1}
      color='white'
      cursor='pointer'
      transition='box-shadow 0.2s'
      sx={{
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          boxSizing: 'content-box',
          pointerEvents: 'none',
          top: 0,
          left: 0,
          padding: 0,
          boxShadow: '0 0 0 3px #fff',
          transition: 'transform 0.2s, opacity 0.2s',
        },
        '&:hover::after': {
          transform: 'scale(0.85)',
          opacity: 0.5
        }
      }}
    >
      <BsCartX 
        className='text-[#E8E9F3]'
        style={{
          fontSize: '26px',
          display: 'block',
          lineHeight: '90px',
          WebkitFontSmoothing: 'antialiased'
        }}
      />
    </IconButton>
  );
}