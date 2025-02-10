'use client';
import { useEffect, useState } from 'react';
import { AddProductsModal } from './components/AddProductsModal';
import { ProductCard } from './components/ProductCard';
import { getAllProducts } from './utils/dbHelpers';

export default function Home() {
  const [products, setProducts] = useState([]);
  console.log('PRODUCTS', products);

  useEffect(() => {
    //request to get all products
    getAllProducts().then((products) => {
      setProducts(products);
    });
  }, []);

  const productsInStock = products.filter((product) => product.quantity > 0);

  // const getAllProductsInStock
  return (
    <div className=''>
      <AddProductsModal />
      {productsInStock.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
