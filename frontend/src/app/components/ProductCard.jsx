// import React from 'react'
import { Box, Text, Button, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import { EditProductModal } from './EditProductModal';
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
      className='w-80 h-[365px]'
    >
      {console.log('product card!', product)}
      {product.image && (
        <div style={{ position: 'relative', width: '100%', height: '200px' }}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
      <VStack align='start' spacing={2} mt={3}>
        <Text fontSize='xl' fontWeight='bold'>
          {`${product.name} - ${product.description}`}
        </Text>
        <div className='flex justify-between w-full'>
          <Text fontSize='lg' fontWeight='semibold' color='teal.500'>
            ${product.price}
          </Text>
          <Text fontSize='lg' fontWeight='semibold' color='teal.500'>
            {product.quantity} in stock
          </Text>
        </div>
        <EditProductModal product={product} />
      </VStack>
    </Box>
  );
};
