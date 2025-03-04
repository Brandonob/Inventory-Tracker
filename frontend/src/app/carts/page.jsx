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
  updateCartProductQuantity,
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
    const stockQuantity = product.productStock;

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

      const data = await response.json();
      console.log('Cart updated', data);
    } catch (error) {
      console.log('ERROR IN UPDATE CART', error.message);
    }
  };

  //handleSetActiveCartBtn is a function that sets the active cart in RTK state
  const handleSetActiveCartBtn = async (cart) => {
    //iterate over cart products and check if each product is in stock
    const cartProducts = cart.products;

    cartProducts.forEach((cartProduct) => {
      debugger;
      const product = findProductById(cartProduct.productId);
      const stockQuantity = product.productStock;

      if (isCartProductInStock(cartProduct)) {
        //update cart in database
        //if cart is not active, set isActiveCart to true
        const updatedCart = updateCart(cart._id, { isActiveCart: true });

        if (updatedCart) {
          //add product to activeCart in RTK state
          dispatch(
            addProductToActiveCart({
              product: product,
              quantity: cartProduct.quantity,
            })
          );
          //set activeCartName in RTK state
          dispatch(setActiveCartName(cart.cartName));
          //set activeCartId in RTK state
          dispatch(setActiveCartId(cart._id));
        } else {
          console.log('CART FAILED TO UPDATE');
        }
      } else {
        //update cart in database to update cart product quantity
        //if quantity is greater than stock, set quantity to stock
        //if stock is 0, remove product from cart
        // const product = findProductById(cartProduct.productId);
        // const stockQuantity = product.productStock;

        if (stockQuantity < 1) {
          //remove product from cart
          const updatedCart = updateCart(cart._id, {
            products: cartProducts.filter(
              (product) => product.productId !== cartProduct.productId
            ),
          });

          if (updatedCart) {
            console.log('Cart updated');
            //save name and description for toast notification
          } else {
            console.log('CART FAILED TO UPDATE');
          }
        } else {
          //update cart in database to update cart product quantity
          const cartData = {
            products: cartProducts.map((product) => ({
              ...product,
              quantity: stockQuantity,
            })),
          };
          const updatedCart = updateCart(cart._id, cartData);

          if (updatedCart) {
            dispatch(
              updateCartProductQuantity({
                productId: cartProduct.productId,
                quantity: stockQuantity,
              })
            );
            console.log('Cart updated');
          } else {
            console.log('CART FAILED TO UPDATE');
          }
        }
      }
    });
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
