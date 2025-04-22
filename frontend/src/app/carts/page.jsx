'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
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
  getAllCarts,
  removeCart,
  addProductToActiveCart,
  setActiveCartName,
  setActiveCartId,
  clearActiveCartProducts,
  setLoading,
  setError,
  setLoadingComplete,
  setActiveCart,
} from '../redux/slices/cartsSlice';
import { fetchAllProducts } from '../redux/slices/productsSlice';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import hb from '../components/media/hb.png';
import Link from 'next/link';
import { CartModal } from '../components/CartModal';
import { NavMenu } from '../components/NavMenu';
import { CartsLoadingState } from '../components/LoadingStates/CartsLoadingState';
import Tilt from 'react-parallax-tilt';
import hbaby from '../components/media/hbaby.png';

export default function Cart() {
  const [pageLoading, setPageLoading] = useState(true);
  const dispatch = useDispatch();
  const allCarts = useSelector((state) => state.carts.allCarts);
  const activeCart = useSelector((state) => state.carts.activeCart);
  const allProducts = useSelector((state) => state.products.allProducts);
  const loading = useSelector((state) => state.carts.loading);
  const toast = useToast();

  const findActiveCart = React.useMemo(() => {
    return allCarts.find(cart => cart.isActiveCart === true);
  }, [allCarts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    dispatch(getAllCarts());
    dispatch(fetchAllProducts());
  }, [dispatch]);

  if (pageLoading || loading) {
    return <CartsLoadingState />;
  }

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
      return null;
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
    let canSetActiveCart = true;
    try {
      dispatch(setLoading());
      const cartProducts = cart.products;
      
      // Clear existing active cart from Redux state first
      dispatch(setActiveCartId(null));
      dispatch(setActiveCartName(''));
      dispatch(clearActiveCartProducts());
      
      // Process all cart products first
      for (const cartProduct of cartProducts) {
        const product = findProductById(cartProduct.productId);
        const stockQuantity = product.quantity;

        if (stockQuantity < 1) {
          const cartData = { method: 'DELETE' };
          const updatedCart = await updateCartProduct(cart._id, cartProduct.productId, cartData);
          
          if (!updatedCart) {
            dispatch(setError('Failed to remove out of stock product'));
            toast({
              title: 'Cart failed to update',
              description: 'Out of stock product not removed from cart',
              status: 'error',
              duration: 3000,
            });
            canSetActiveCart = false;
          } else {
            toast({
              title: 'Product out of stock!',
              description: 'Product removed from cart',
              status: 'warning',
              duration: 3000,
            });
          }
        } else if (stockQuantity < cartProduct.quantity) {
          const cartData = {
            quantity: stockQuantity,
            method: 'UPDATE',
          };
          
          const updatedCart = await updateCartProduct(cart._id, cartProduct.productId, cartData);
          
          if (!updatedCart) {
            dispatch(setError('Failed to update product quantity'));
            toast({
              title: 'Cart failed to update',
              description: 'Partial stock quantity not updated',
              status: 'error',
              duration: 3000,
            });
            canSetActiveCart = false;
          } else {
            toast({
              title: 'Cart updated',
              description: 'Product quantity adjusted to match available stock',
              status: 'success',
              duration: 3000,
            });
          }
        }
      }

      if (canSetActiveCart) {
        for (const existingCart of allCarts) {
          if (existingCart.isActiveCart) {
            await updateCart(existingCart._id, { isActiveCart: false });
          }
        }

        const cartData = { isActiveCart: true };
        const updatedCart = await updateCart(cart._id, cartData);

        if (updatedCart) {
          const availableProducts = cartProducts.filter(cartProduct => {
            const product = findProductById(cartProduct.productId);
            return product.quantity > 0;
          }).map(cartProduct => {
            const product = findProductById(cartProduct.productId);
            return {
              product,
              quantity: Math.min(cartProduct.quantity, product.quantity)
            };
          });

          availableProducts.forEach(({ product, quantity }) => {
            if (activeCart.products.length === 0) {
              dispatch(setActiveCart({ product, quantity }));
            } else {
              dispatch(addProductToActiveCart({ product, quantity }));
            }
          });
          
          dispatch(setActiveCartName(cart.cartName));
          dispatch(setActiveCartId(cart._id));
          dispatch(getAllCarts());
          dispatch(setLoadingComplete());

          toast({
            title: 'Cart Activated',
            description: 'Previous cart cleared and new cart set as active',
            status: 'success',
            duration: 3000,
          });
        } else {
          dispatch(setError('Failed to set cart as active'));
          toast({
            title: 'Error',
            description: 'Failed to set cart as active',
            status: 'error',
            duration: 3000,
          });
        }
      }
    } catch (error) {
      dispatch(setError(error.message));
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        status: 'error',
        duration: 3000,
      });
      canSetActiveCart = false;
    } finally {
      if (!canSetActiveCart) {
        dispatch(setLoadingComplete());
      }
    }
  };

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
    <div className='flex flex-col items-center justify-center bg-white dark:bg-black min-h-screen transition-colors duration-200'>
      <div className='flex items-center justify-center'>
        <Link href="/">
          <Image src={hb} alt='logo' width={300} height={300} />
        </Link>
      </div>
      <div className='w-[90%] mx-auto'>
        <Heading mb={4} className='text-black dark:text-white transition-colors duration-200'>Shopping Carts</Heading>
        <Text mb={4} className='text-black dark:text-white transition-colors duration-200'>
          Active Cart: {findActiveCart?.cartName || 'No active cart'}
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {allCarts.length === 0 ? (
            <Text className='text-black dark:text-white transition-colors duration-200'>No carts saved!</Text>
          ) : (
            allCarts.map((cart, index) => (
              <Card
                key={index}
                boxShadow='md'
                borderRadius='lg'
                overflow='hidden'
                className='bg-white dark:bg-gray-800 transition-colors duration-200'
              >
                <CardBody>
                  <Heading size='md' mb={2} className='text-black dark:text-white transition-colors duration-200'>
                    {`${cart.cartName || 'Untitled'} Cart`}
                  </Heading>
                  <Text mb={2} className='text-black dark:text-white transition-colors duration-200'>
                    Items: {cart.products.length}
                  </Text>
                  <Text fontWeight='bold' color='green.500'>
                    Total: ${getCartTotal(cart).toFixed(2) || '0.00'}
                  </Text>
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
                    ml={2}
                    colorScheme='red'
                  >
                    Delete Cart
                  </Button>
                </CardBody>
              </Card>
            ))
          )}
        </SimpleGrid>
      </div>
      <CartModal activeCart={activeCart || { products: [] }} />
      <NavMenu />
      <Tilt>
        <Box display="flex" justifyContent="center" mb={4}>
          <Link href="/">
            <Image src={hbaby} alt='logo' width={300} height={300} />
          </Link>
        </Box>
      </Tilt>
    </div>
  );
}
