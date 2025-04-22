'use client';
import React, { useEffect, useState } from 'react';
import { AddProductsModal } from './components/AddProductsModal';
import { ProductCard } from './components/ProductCard';
import { fetchAllProducts } from './redux/slices/productsSlice';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import hb from './components/media/hb.png';
import hbaby from './components/media/hbaby.png';
import { Box } from '@chakra-ui/react';
import { InitializeDB } from './utils/InitializeDB';
// import { SaveCartButton } from './components/SaveCart';
import { CartModal } from './components/CartModal';
import { NavMenu } from './components/NavMenu';
import Link from 'next/link';
import { setActiveCartName, setActiveCartId, addProductToActiveCart, getAllCarts } from './redux/slices/cartsSlice';
import { NewCartButton } from './components/NewCartButton';
import Tilt from 'react-parallax-tilt';
import { ProductCardLoadingState } from './components/ProductCardLoadingState';
import { HomeLoadingState } from './components/LoadingStates/HomeLoadingState';

export default function Home() {
  const [pageLoading, setPageLoading] = useState(true);
  const { allProducts, loading, error } = useSelector(
    (state) => state.products
  );
  const allCarts = useSelector((state) => state.carts.allCarts);
  const activeCart = useSelector((state) => state.carts.activeCart);
  const activeCartProducts = activeCart?.products || [];
  const activeCartId = useSelector((state) => state.carts.activeCartId);
  const user = useSelector((state) => state.users.user);
  const isLoggedIn = !!user;
  const dispatch = useDispatch();

  console.log('USER', user);
  

  // Add memoized function to find active cart
  const findActiveCart = React.useMemo(() => {
    return allCarts.find(cart => cart.isActiveCart === true);
  }, [allCarts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 2000); // Show loading state for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    dispatch(getAllCarts());
    dispatch(fetchAllProducts());
    // If there's an active cart, set it in the Redux state
    if (findActiveCart) {
      dispatch(setActiveCartName(findActiveCart.cartName));
      dispatch(setActiveCartId(findActiveCart._id));
      findActiveCart.products.forEach(product => {
        dispatch(addProductToActiveCart({
          product: product,
          quantity: product.quantity
        }));
      });
    }
  }, [findActiveCart]);

  const productsInStock = allProducts.filter((product) => product.quantity > 0);
  console.log('PRODUCTS IN STOCK', productsInStock);

  if (pageLoading || loading) {
    return <HomeLoadingState />;
  }

  return (
    <>
      <InitializeDB />
      <div className='flex flex-col items-center justify-center bg-white dark:bg-black min-h-screen transition-colors duration-200'>
        <div className='flex items-center justify-center'>
          <Link href="/">
            <Image src={hb} alt='logo' width={300} height={300} />
          </Link>
        </div>
        <div className='flex flex-col w-3/4'>
          <div className='flex justify-between items-center'>
            <h1 className='text-4xl font-bold text-black dark:text-white transition-colors duration-200'>In Stock</h1>
          </div>
          <div className='flex items-center'>
            {isLoggedIn && <AddProductsModal />}
            <NewCartButton />
          </div>
          {/* <SaveCartButton activeCart={activeCart} cartId={activeCartId} /> */}
          <div className='bg-white dark:bg-gray-800 rounded-3xl mt-12 transition-colors duration-200'>
            <div className='flex flex-wrap gap-4 justify-center rounded-3xl bg-[rgb(90,103,250)]/80 p-8 
              shadow-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-[rgb(90,103,250)]/50'>
              {productsInStock.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
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
    </>
  );
}
