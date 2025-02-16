'use client';
import React from 'react';
import { Box, Text, VStack, HStack, Image, IconButton } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { removeProductFromActiveCart } from '../redux/slices/cartsSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function Cart() {
  const dispatch = useDispatch();
  const carts = useSelector((state) => state.carts.allCarts);
  const activeCart = useSelector((state) => state.carts.activeCart);

  return (
    <Box
      maxW='lg'
      mx='auto'
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius='lg'
      boxShadow='lg'
    >
      <Text fontSize='2xl' fontWeight='bold' mb={4}>
        Shopping Cart
      </Text>
      <VStack spacing={4} align='stretch'>
        {activeCart.products.length === 0 ? (
          <Text>Your cart is empty</Text>
        ) : (
          activeCart.products.map((cartItem) => (
            <HStack
              key={cartItem.product._id}
              p={3}
              borderWidth={1}
              borderRadius='md'
              justifyContent='space-between'
            >
              <Image
                boxSize='50px'
                src={cartItem.product.image}
                alt={cartItem.product.name}
                borderRadius='md'
              />
              <Text flex={1}>{cartItem.product.name}</Text>
              <Text fontWeight='bold'>${cartItem.product.price}</Text>
              <IconButton
                icon={<FaTrash />}
                colorScheme='red'
                onClick={() =>
                  dispatch(removeProductFromActiveCart(cartItem.product._id))
                }
                aria-label='Remove from cart'
              />
            </HStack>
          ))
        )}
      </VStack>
    </Box>
  );
}
