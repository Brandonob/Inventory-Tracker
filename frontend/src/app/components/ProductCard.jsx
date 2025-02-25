// import React from 'react'
import {
  Box,
  Text,
  Button,
  VStack,
  IconButton,
  useToast,
  Tooltip,
  useNumberInput,
  HStack,
  Input,
} from '@chakra-ui/react';
import Image from 'next/image';
import { EditProductModal } from './EditProductModal';
import { FaCartPlus } from 'react-icons/fa';
import { MdOutlineImageNotSupported } from 'react-icons/md';
import {
  addProductToActiveCart,
  removeProductFromActiveCart,
  setActiveCart,
  incrementCartItemQuantity,
  decrementCartItemQuantity,
  isProductInActiveCart,
  setActiveCartId,
} from '../redux/slices/cartsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { QuantitySelector } from './QuantitySelector';

export const ProductCard = ({ product }) => {
  console.log('PRODUCT CARD', product);
  const dispatch = useDispatch();
  const toast = useToast();

  // Subscribe to the specific cart item's quantity instead of the whole state
  const cartItem = useSelector((state) =>
    state.carts.activeCart.products.find(
      (item) => item.product._id === product._id
    )
  );
  const isInActiveCart = Boolean(cartItem);
  const activeCartId = useSelector((state) => state.carts.activeCartId);
  const activeCart = useSelector((state) => state.carts.activeCart);

  //check if product is in active cart
  // const tooltip = useTooltip();
  // const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
  //   useNumberInput({
  //     value,
  //     step: 1,
  //     min: 1,
  //     max: product.quantity,
  //     precision: 0,
  //   });

  // const increment = getIncrementButtonProps();
  // const decrement = getDecrementButtonProps();
  // const input = getInputProps();

  const createNewCartGetId = async () => {
    try {
      const newCart = await fetch('/api/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const newCartData = await newCart.json();
      return newCartData.insertedId;
    } catch (error) {
      console.log('ERROR IN CREATE NEW CART GET ID', error.message);
    }
  };

  const handleAddToActiveCart = async (product) => {
    // debugger;
    //Send to RTK and return succes toast
    //if active cart is empty, set the product to the active cart
    const activeCartLength = activeCart.products.length;
    // const activeCartId = state.activeCartId;

    if (activeCartLength === 0 && activeCartId === null) {
      //Post new cart to db and get the id
      //set the id to the active cart id
      //add the product to the active cart
      // const newCartId = await createNewCartGetId();
      // console.log('NEW CART ID', newCartId);
      //set active cart id in redux
      // dispatch(setActiveCartId(newCartId));
      //add the product to the active cart in redux
      dispatch(setActiveCart({ product, quantity: 1 }));
    } else {
      //add the product to the active cart in redux
      dispatch(addProductToActiveCart({ product, quantity: 1 }));
    }

    toast({
      title: 'Product added to cart!',
      description: 'You can view your cart in the cart page',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // const handleDecrement = (product) => {
  //   //removes product from active cart if quantity is 1
  //   if (input.value === 1) {
  //     dispatch(removeProductFromActiveCart(product));
  //   } else {
  //     dispatch(
  //       decrementCartItemQuantity({ product, quantity: input.value - 1 })
  //     );
  //   }
  // };

  // const handleIncrement = (product) => {
  //   //return error toast if product quantity is maxed out
  //   if (input.value === product.quantity) {
  //     toast({
  //       title: 'Product quantity is maxed out',
  //       description: 'You can not add more than the product quantity',
  //       status: 'error',
  //     });
  //   } else {
  //     dispatch(incrementCartItemQuantity({ product, quantity: 1 }));
  //   }
  // };

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
      {product.image ? (
        <div className='relative w-full h-[200px]'>
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      ) : (
        <div className='w-full h-[200px] flex flex-col items-center justify-center'>
          <MdOutlineImageNotSupported size={100} />
          <Text>No image available</Text>
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

          {isInActiveCart ? (
            <QuantitySelector cartItem={cartItem} />
          ) : (
            <Tooltip label='Add to cart' placement='left'>
              <IconButton
                onClick={() => handleAddToActiveCart(product)}
                aria-label='Add to cart'
              >
                <FaCartPlus />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </VStack>
    </Box>
  );
};
