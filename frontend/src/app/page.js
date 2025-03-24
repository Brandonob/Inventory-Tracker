'use client';
import React, { useEffect, useState } from 'react';
import { AddProductsModal } from './components/AddProductsModal';
import { ProductCard } from './components/ProductCard';
import { fetchAllProducts } from './redux/slices/productsSlice';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import hb from './components/media/hb.png';
import { InitializeDB } from './utils/InitializeDB';
// import { SaveCartButton } from './components/SaveCart';
import { CartModal } from './components/CartModal';
import { NavMenu } from './components/NavMenu';
import Link from 'next/link';
import { setActiveCartName, setActiveCartId, addProductToActiveCart, getAllCarts } from './redux/slices/cartsSlice';
import { NewCartButton } from './components/NewCartButton';

export default function Home() {
  const { allProducts, loading, error } = useSelector(
    (state) => state.products
  );
  const allCarts = useSelector((state) => state.carts.allCarts);
  const activeCart = useSelector((state) => state.carts.activeCart);
  const activeCartProducts = activeCart?.products || [];
  const activeCartId = useSelector((state) => state.carts.activeCartId);
  const user = useSelector((state) => state.users.user.length > 0);
  const dispatch = useDispatch();

  // Add memoized function to find active cart
  const findActiveCart = React.useMemo(() => {
    return allCarts.find(cart => cart.isActiveCart === true);
  }, [allCarts]);

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

  // const getAllProductsInStock
  return (
    <>
      <InitializeDB />
      <div className='flex flex-col items-center justify-center bg-black h-full'>
        <div className='flex items-center justify-center'>
          <Link href="/">
            <Image src={hb} alt='logo' width={300} height={300} />
          </Link>
        </div>
        <div className='flex flex-col w-3/4'>
          <div className='flex justify-between items-center'>
            <h1 className='text-4xl font-bold text-white'>In Stock</h1>
          </div>
          <div className='flex items-center'>
            {user && <AddProductsModal />}
            <NewCartButton />
          </div>
          {/* <SaveCartButton activeCart={activeCart} cartId={activeCartId} /> */}
          <div className='flex flex-wrap gap-4 justify-center mt-12 rounded-3xl bg-[rgb(90,103,250)] p-8'>
            {productsInStock.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
        <CartModal activeCart={activeCart || { products: [] }} />
        {/* <CartPreviewModal activeCart={activeCart} /> */}
        {user && <NavMenu />}
      </div>
    </>
  );
}
