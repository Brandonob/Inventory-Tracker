'use client';
import { useEffect, useState } from 'react';
import { AddProductsModal } from './components/AddProductsModal';
import { ProductCard } from './components/ProductCard';
import { getAllProducts } from './utils/dbHelpers';
import Image from 'next/image';
import pookieIcon from './components/media/pookieIcon.png';

export default function Home() {
  const [products, setProducts] = useState([]);
  console.log('PRODUCTS', products);

  useEffect(() => {
    //request to get all products
    getAllProducts().then((products) => {
      setProducts(products);
    });
  }, [products]);

  const productsInStock = products.filter((product) => product.quantity > 0);

  // const getAllProductsInStock
  return (
    <div className='flex flex-col items-center justify-center bg-black'>
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
