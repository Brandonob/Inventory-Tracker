import React from 'react';
import { Box, Skeleton, VStack } from '@chakra-ui/react';
import { ButtonLoadingState } from './ButtonLoadingState';
import { NavMenuLoadingState } from './NavMenuLoadingState';
import { ProductCardLoadingState } from '../ProductCardLoadingState';
import Image from 'next/image';
import inventoryLogo from '../media/inventory.png';
import Link from 'next/link';
import Tilt from 'react-parallax-tilt';

export const HomeLoadingState = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black transition-colors duration-200'>
      <NavMenuLoadingState />
      
      <div className='flex items-center justify-center h-[200px]'>
        <Link href="/">
          {/* <Image src={hb} alt='logo' width={300} height={300} /> */}
          <h1 style={{ fontFamily: 'zombriya', fontSize: '42px', fontWeight: 'bold', textAlign: 'center' }} className='text-black dark:text-white'>INVENTORY TRACKER</h1>
        </Link>
      </div>

      <div className='flex flex-col w-3/4'>
        <div className='flex justify-between items-center'>
          <Skeleton height="48px" width="200px" className="dark:bg-gray-700" />
        </div>
        
        <div className='flex items-center mt-4'>
          <ButtonLoadingState />
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-3xl mt-12 transition-colors duration-200'>
          <ProductCardLoadingState />
        </div>
      </div>

      <Tilt>
        <Box display="flex" justifyContent="center" mt="48px">
          <Link href="/">
            <Image src={inventoryLogo} alt='logo' width={300} height={300} />
          </Link>
        </Box>
      </Tilt>
    </div>
  );
}; 