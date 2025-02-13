'use client';
import React from 'react';
import { Box, Text, VStack, HStack, Image, IconButton } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { removeFromCart } from '../redux/slices/cartsSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);

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
        {cart.length === 0 ? (
          <Text>Your cart is empty</Text>
        ) : (
          cart.map((product) => (
            <HStack
              key={product._id}
              p={3}
              borderWidth={1}
              borderRadius='md'
              justifyContent='space-between'
            >
              <Image
                boxSize='50px'
                src={product.image}
                alt={product.name}
                borderRadius='md'
              />
              <Text flex={1}>{product.name}</Text>
              <Text fontWeight='bold'>${product.price}</Text>
              <IconButton
                icon={<FaTrash />}
                colorScheme='red'
                onClick={() => removeFromCart(product._id)}
                aria-label='Remove from cart'
              />
            </HStack>
          ))
        )}
      </VStack>
    </Box>
  );
}
