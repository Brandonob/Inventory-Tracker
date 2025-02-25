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
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import {
  removeProductFromActiveCart,
  setActiveCart,
  getAllCarts,
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

  const cartImages = (cartIem) => {};

  //get the active cart from the allCarts RTK state
  //add isActive to carts collection
  //set the active cart to the cart with isActive true
  console.log(allCarts);

  return (
    <Box p={5}>
      <Heading mb={4}>Shopping Carts</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
        {allCarts.map((cart, index) => (
          <Card key={index} boxShadow='md' borderRadius='lg' overflow='hidden'>
            <CardBody>
              <Heading size='md' mb={2}>
                {`${cart.name} Cart`}
              </Heading>
              <Text mb={2}>Items: {cart.items.length}</Text>
              <Text fontWeight='bold' color='green.500'>
                Total: ${cart.total.toFixed(2)}
              </Text>
              <Button mt={3} colorScheme='blue'>
                View Cart
              </Button>
            </CardBody>
          </Card>
        ))}
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
