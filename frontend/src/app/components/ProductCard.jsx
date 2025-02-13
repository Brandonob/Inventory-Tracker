// import React from 'react'
import {
  Box,
  Text,
  Button,
  VStack,
  IconButton,
  useToast,
  // useTooltip,
  Tooltip,
} from '@chakra-ui/react';
import Image from 'next/image';
import { EditProductModal } from './EditProductModal';
import { FaCartPlus } from 'react-icons/fa';
import { addToCart } from '../redux/slices/cartsSlice';
import { useDispatch } from 'react-redux';
// import { Tooltip } from '../../components/ui/tooltip';

export const ProductCard = ({ product }) => {
  console.log('PRODUCT CARD', product);
  const dispatch = useDispatch();
  const toast = useToast();
  // const tooltip = useTooltip();

  const handleAddToCart = (product) => {
    //Send to RTK and return succes toast
    dispatch(addToCart(product));
    toast({
      title: 'Product added to cart!',
      description: 'You can view your cart in the cart page',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

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
        <div className='flex justify-between w-full'>
          <EditProductModal product={product} />

          <Tooltip label='Add to cart' placement='left'>
            <IconButton
              onClick={() => handleAddToCart(product)}
              aria-label='Add to cart'
            >
              <FaCartPlus />
            </IconButton>
          </Tooltip>
        </div>
      </VStack>
    </Box>
  );
};
