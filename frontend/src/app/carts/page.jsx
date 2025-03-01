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
} from '../redux/slices/cartsSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function Cart() {
  const dispatch = useDispatch();
  const allCarts = useSelector((state) => state.carts.allCarts);
  const activeCart = useSelector((state) => state.carts.activeCart);
  //on page load grab all carts from the database
  useEffect(() => {
    dispatch(getAllCarts());
  }, []);

  const getCartImages = (cart) => {
    return cart.products.map((product) => product.product.image);
  };
  const getCartTotal = (cart) => {
    return cart.products.reduce((total, product) => total + product.price, 0);
  };

  //get the active cart from the allCarts RTK state
  //add isActive to carts collection
  //set the active cart to the cart with isActive true
  console.log(allCarts);

  const handleDeleteCart = async (cartId) => {
    debugger;
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
                <Button mt={3} colorScheme='blue'>
                  View Cart
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
    // <Box
    //   maxW='lg'
    //   mx='auto'
    //   mt={10}
    //   p={6}
    //   borderWidth={1}
    //   borderRadius='lg'
    //   boxShadow='lg'
    // >
    //   <Text fontSize='2xl' fontWeight='bold' mb={4}>
    //     Shopping Cart
    //   </Text>
    //   <VStack spacing={4} align='stretch'>
    //     {activeCart.products.length === 0 ? (
    //       <Text>Your cart is empty</Text>
    //     ) : (
    //       activeCart.products.map((cartItem) => (
    //         <HStack
    //           key={cartItem.product._id}
    //           p={3}
    //           borderWidth={1}
    //           borderRadius='md'
    //           justifyContent='space-between'
    //         >
    //           <Image
    //             boxSize='50px'
    //             src={cartItem.product.image}
    //             alt={cartItem.product.name}
    //             borderRadius='md'
    //           />
    //           <Text flex={1}>{cartItem.product.name}</Text>
    //           <Text fontWeight='bold'>${cartItem.product.price}</Text>
    //           <IconButton
    //             icon={<FaTrash />}
    //             colorScheme='red'
    //             onClick={() =>
    //               dispatch(removeProductFromActiveCart(cartItem.product._id))
    //             }
    //             aria-label='Remove from cart'
    //           />
    //         </HStack>
    //       ))
    //     )}
    //   </VStack>
    // </Box>
  );
}
