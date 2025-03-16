'use client';
import React, { useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Image,
  IconButton,
  Heading,
  Card,
  CardBody,
  SimpleGrid,
  Button,
  useToast,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import {
  setActiveCart,
  getAllCarts,
  removeCart,
  setActiveCart,
} from '../redux/slices/cartsSlice';
import { fetchAllProducts } from '../redux/slices/productsSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function Cart() {
  const dispatch = useDispatch();
  const allCarts = useSelector((state) => state.carts.allCarts);
  const activeCart = useSelector((state) => state.carts.activeCart);
  const allProducts = useSelector((state) => state.products.allProducts);
  const toast = useToast();
  //on page load grab all carts from the database
  //on page load grab all products from the database
  useEffect(() => {
    dispatch(getAllCarts());
    dispatch(fetchAllProducts());
  }, []);

  const getCartImages = (cart) => {
    return cart.products.map((product) => product.productImg);
  };
  const getCartTotal = (cart) => {
    return cart.products.reduce(
      (total, product) =>
        (total += parseInt(product.productPrice) * parseInt(product.quantity)),
      0
    );
  };
  const findProductById = (productId) => {
    return allProducts.find((product) => {
      if (product._id === productId) {
        return product;
      }
    });
  };
  //function to check if products in cart are in stock and quantity is less than or equal to stock
  const isCartProductInStock = (cartProduct) => {
    debugger;
    //get product from allProducts array
    const product = findProductById(cartProduct.productId);
    const stockQuantity = product.quantity;

    if (stockQuantity >= cartProduct.quantity) {
      return true;
    } else {
      return false;
    }
  };

  const updateCart = async (cartId, cartData) => {
    debugger;
    try {
      const response = await fetch(`/api/carts/${cartId}`, {
        method: 'PATCH',
        body: JSON.stringify(cartData),
        headers: {
          'Content-Type': 'application/json',
          },
        });

      if (!response.ok) {
        console.log('Cart not updated');
        throw new Error('Cart not updated');
      }
      
      const updatedCart = await response.json();
      console.log('Cart updated', updatedCart);
      return updatedCart;
    } catch (error) {
      console.log('ERROR IN UPDATE CART', error.message);
    }
  };

  const updateCartProduct = async (cartId, cartProductId, cartData) => {
    debugger;
    try {
      const response = await fetch(`/api/carts/${cartId}/${cartProductId}`, {
        method: 'PATCH',
        body: JSON.stringify(cartData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.log('Cart not updated');
        throw new Error('Cart not updated');
      }

      const updatedCart = await response.json();
      console.log('Cart updated', updatedCart);
    } catch (error) {
      console.log('ERROR IN UPDATE CART', error.message);
    }
  };

  //handleSetActiveCartBtn is a function that sets the active cart in RTK state
  const handleSetActiveCartBtn = async (cart) => {
    //iterate over cart products and check if each product is in stock
    const cartProducts = cart.products;

    cartProducts.forEach((cartProduct) => {
      debugger;
      const product = findProductById(cartProduct.productId);
      const stockQuantity = product.quantity;

      if (isCartProductInStock(cartProduct)) {
        //update cart in database
        //if cart is not active, set isActiveCart to true
        const updatedCart = updateCart(cart._id, { isActiveCart: true });

        if (updatedCart) {
          //add product to activeCart in RTK state
          dispatch(
            addProductToActiveCart({
              product: product,
              quantity: cartProduct.quantity,
            })
          );
          //set activeCartName in RTK state
          dispatch(setActiveCartName(cart.cartName));
          //set activeCartId in RTK state
          dispatch(setActiveCartId(cart._id));
        } else {
          console.log('CART FAILED TO UPDATE');
        }
      } else {
        //update cart in database to update cart product quantity
        //if quantity is greater than stock, set quantity to stock
        //if stock is 0, remove product from cart
       
        if (stockQuantity < 1) {
          const cartData = {
            method: 'DELETE',
          };
          //remove product from cart
          const updatedCart = updateCartProduct(cart._id, cartProduct.productId, cartData);

          if (!updatedCart) {
            //save name and description for toast notification
            console.log('CART FAILED TO UPDATE');
            toast({
              title: 'Cart failed to update',
              description: 'Out of stock product not removed from cart',
              status: 'error',
              duration: 3000,
            });
          } else {
            console.log('Cart updated', updatedCart);
            toast({
              title: 'Product out of stock!',
              description: 'Product removed from cart',
              status: 'warning',
              duration: 3000,
            });
          }

        } else {
          //update cart product in database to update cart product quantity
          const cartData = {
              quantity: stockQuantity,
              method: 'UPDATE',
          };
          console.log('CART DATA', cartData);
          
          const updatedCart = updateCartProduct(cart._id, cartProduct.productId, cartData);

          if (!updatedCart) {

            console.log('CART FAILED TO UPDATE');
            toast({
              title: 'Cart failed to update',
              description: 'Partial stock quantity not updated',
              status: 'error',
              duration: 3000,
            });

          } else {
            console.log('Cart updated');
            dispatch(({
                productId: cartProduct.productId,
                quantity: stockQuantity,
              })
            );
            toast({
              title: 'Cart updated',
              description: 'Partial stock quantity updated',
              status: 'success',
              duration: 3000,
            });
          }
        }
      }
    });
  };

  const handleDeleteCart = async (cartId) => {
    // debugger;
    try {
      //remove cart from database
      const response = await fetch(`/api/carts/${cartId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.log('Cart not deleted');
        throw new Error('Cart not deleted');
      }
      console.log('Cart deleted', data);
      dispatch(removeCart(cartId));
      toast({
        title: 'Cart deleted',
        description: 'Cart deleted successfully',
        status: 'success',
        duration: 3000, 
      });
    } catch (error) {
      console.log('ERROR IN DELETE CART', error.message);
      toast({
        title: 'Cart not deleted',
        description: 'Cart not deleted',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box p={5}>
      <Heading mb={4}>Shopping Carts</Heading>
      <Text mb={4}>Active Cart: {activeCart.cartName || 'No active cart'}</Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
        {allCarts.length === 0 ? (
          <Text>No carts saved!</Text>
        ) : (
          allCarts.map((cart, index) => (
            <Card
              key={index}
              boxShadow='md'
              borderRadius='lg'
              overflow='hidden'
            >
              <CardBody>
                <Heading size='md' mb={2}>
                  {`${cart.cartName || 'Untitled'} Cart`}
                </Heading>
                <Text mb={2}>Items: {cart.products.length}</Text>
                <Text fontWeight='bold' color='green.500'>
                  Total: ${getCartTotal(cart).toFixed(2) || '0.00'}
                </Text>
                {/* Prompt user to save current cart before setting a new one */} 
                <Button
                  onClick={() => activeCart.length > 0 ? toast({
                    title: 'Save Cart ',
                    description: 'Please save your current cart before setting a new one',
                    status: 'error',
                    duration: 3000, 
                  }) : handleSetActiveCartBtn(cart)}
                  mt={3}
                  colorScheme='blue'
                >
                  Set Active Cart
                </Button>
                <Button
                  onClick={() => handleDeleteCart(cart._id)}
                  mt={3}
                  colorScheme='red'
                >
                  Delete Cart
                </Button>
              </CardBody>
            </Card>
          ))
        )}
      </SimpleGrid>
    </Box>
  );
}
