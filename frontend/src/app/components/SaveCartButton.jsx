import React from 'react';
import { Button } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

export const SaveCartButton = ({ activeCart, cartId }) => {
  const toast = useToast();

  const getActiveCartData = () => {
    const data = [];
    activeCart.products.forEach((product) => {
      //   debugger;
      data.push({
        productId: product.product._id,
        quantity: product.quantity,
      });
    });
    return data;
  };

  const handleSaveCart = async (e) => {
    e.preventDefault();
    // debugger;
    try {
      const activeCartData = await getActiveCartData();
      //update cart in database to store activeCart
      const response = await fetch('/api/carts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartId, activeCartData }),
      });
      const data = await response.json();
      console.log('UPDATED CART', data);

      if (response.ok) {
        console.log('Cart updated');
        toast({
          title: 'Cart updated',
          description: 'Cart updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.log('Cart not updated');
        toast({
          title: 'Cart not updated',
          description: 'Cart not updated successfully',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      //   dispatch(setActiveCart(data));
    } catch (error) {
      console.log('ERROR IN SAVE CART', error.message);
    }
  };

  return (
    <div>
      <Button onClick={handleSaveCart}>Save Cart</Button>
    </div>
  );
};
