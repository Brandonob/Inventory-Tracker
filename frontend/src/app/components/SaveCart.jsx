import { useToast } from '@chakra-ui/react';

export const saveCart = async ({ activeCart, cartName }) => {
  const toast = useToast();

  const getActiveCartData = () => {
    const data = [];
    activeCart.products.forEach((product) => {
      //   debugger;
      data.push({
        productId: product.product._id,
        productImg: product.product.image,
        productPrice: product.product.price,
        quantity: product.quantity,
      });
    });
    return data;
  };
  // debugger;
  try {
    const activeCartData = await getActiveCartData();
    //update cart in database to store activeCart
    const response = await fetch('/api/carts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartName, activeCartData }),
    });
    const data = await response.json();
    console.log('CREATED NEW CART', data);

    if (response.ok) {
      console.log('Cart updated');
      toast({
        title: 'Cart updated',
        description: 'Cart updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      return data;
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
    console.log('ERROR IN POST CART', error.message);
  }
};
