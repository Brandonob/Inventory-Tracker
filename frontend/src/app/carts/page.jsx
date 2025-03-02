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
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import {
  removeProductFromActiveCart,
  setActiveCart,
  getAllCarts,
  removeCart,
  setActiveCartName,
} from '../redux/slices/cartsSlice';
import { fetchAllProducts } from '../redux/slices/productsSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function Cart() {
  const dispatch = useDispatch();
  const allCarts = useSelector((state) => state.carts.allCarts);
  const activeCart = useSelector((state) => state.carts.activeCart);
  const allProducts = useSelector((state) => state.products.allProducts);
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
      (total, product) => total + parseInt(product.productPrice),
      0
    );
  };
  //function to check if products in cart are in stock and quantity is less than or equal to stock
  const isCartProductsInStock = (cart) => {
    //get product from allProducts array
    return cart.products.every((cartProduct) => {
      //find product stock in allProducts array
      //move this outside of the function to avoid re-rendering
      const stockQuantity = allProducts.find((product) => {
        if (product._id === cartProduct.productId) {
          return product.productStock;
        }
      });

      if (stockQuantity >= cartProduct.quantity) {
        return true;
      } else {
        return false;
      }
    });
  };

  //handleSetActiveCartBtn is a function that sets the active cart in RTK state
  const handleSetActiveCartBtn = (cart) => {
    //set cart to activeCart in RTK state
    dispatch(setActiveCart(cart._id));
    //set activeCartName in RTK state
    dispatch(setActiveCartName(cart.cartName));
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
    } catch (error) {
      console.log('ERROR IN DELETE CART', error.message);
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
                <Button
                  onClick={() => handleSetActiveCartBtn(cart)}
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
