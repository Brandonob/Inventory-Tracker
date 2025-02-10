// import React from 'react'
import { Box, Image, Text, Button, VStack } from '@chakra-ui/react';

export const ProductCard = ({ product }) => {
  console.log('PRODUCT CARD', product);

  return (
    <Box
      borderWidth='1px'
      borderRadius='lg'
      overflow='hidden'
      boxShadow='md'
      p={4}
      bg='white'
      _hover={{ boxShadow: 'xl' }}
      className='w-80 h-80'
    >
      <Image src={product.image} alt={product.name} borderRadius='md' />
      <VStack align='start' spacing={2} mt={3}>
        <Text fontSize='xl' fontWeight='bold'>
          {product.name}
        </Text>
        <Text fontSize='md' color='gray.600'>
          {product.description}
        </Text>
        <Text fontSize='lg' fontWeight='semibold' color='teal.500'>
          ${product.price}
        </Text>
        <Text fontSize='lg' fontWeight='semibold' color='teal.500'>
          {product.quantity} in stock
        </Text>
        {/* <Button colorScheme='teal' size='sm'>
          Add to Cart
        </Button> */}
      </VStack>
    </Box>
  );
};
