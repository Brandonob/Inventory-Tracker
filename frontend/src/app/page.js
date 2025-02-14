'use client';
import { useEffect, useState } from 'react';
import { AddProductsModal } from './components/AddProductsModal';
import { ProductCard } from './components/ProductCard';
// import { getAllProducts } from './utils/dbHelpers';
import { fetchAllProducts } from './redux/slices/productsSlice';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import pookieIcon from './components/media/pookieIcon.png';
import { InitializeDB } from './utils/InitializeDB';
// import { connectToDB } from '../../lib/db';
// import { store } from './redux/store';

export default function Home() {
  const { allProducts, loading, error } = useSelector(
    (state) => state.products
  );
  const dispatch = useDispatch();
  console.log('PRODUCTS', allProducts);

  useEffect(() => {
    // <InitializeDB />;
    //request to get all products
    dispatch(fetchAllProducts());
  }, []);

  // const fetchProducts = async () => {
  //   try {
  //     const products = await getAllProducts();
  //     setProducts(products);
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //     setProducts([]); // Set empty array as fallback
  //   }
  // };

  const productsInStock = allProducts.filter((product) => product.quantity > 0);

  // const getAllProductsInStock
  return (
    <div className='flex flex-col items-center justify-center bg-black'>
      <InitializeDB />
      <div className='flex items-center justify-center'>
        <Image src={pookieIcon} alt='logo' width={300} height={300} />
      </div>
      <div className='flex flex-col w-3/4 '>
        <h1 className='text-4xl font-bold text-white'>In Stock</h1>

        <AddProductsModal />
        <div className='flex flex-wrap gap-4 justify-center mt-12'>
          {productsInStock.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
