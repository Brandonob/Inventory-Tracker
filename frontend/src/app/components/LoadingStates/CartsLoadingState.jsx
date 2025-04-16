import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  SimpleGrid, 
  Card, 
  CardBody,
  Skeleton,
  Stack
} from '@chakra-ui/react';
import Image from 'next/image';
import hb from '../media/hb.png';
import Link from 'next/link';
import { NavMenuLoadingState } from './NavMenuLoadingState';
import hbaby from '../media/hbaby.png';
import Tilt from 'react-parallax-tilt';

const CartCardLoadingState = () => (
  <Card 
    boxShadow='md' 
    borderRadius='lg' 
    overflow='hidden'
    className='bg-white dark:bg-gray-800 transition-colors duration-200'
  >
    <CardBody>
      <Stack spacing={4}>
        <Skeleton height="24px" width="70%" className="dark:bg-gray-700" />
        <Skeleton height="20px" width="40%" className="dark:bg-gray-700" />
        <Skeleton height="20px" width="30%" className="dark:bg-gray-700" />
        <Stack direction="row" spacing={2} mt={2}>
          <Skeleton height="40px" width="120px" className="dark:bg-gray-700" />
          <Skeleton height="40px" width="120px" className="dark:bg-gray-700" />
        </Stack>
      </Stack>
    </CardBody>
  </Card>
);

export const CartsLoadingState = () => {
  return (
    <div className='flex flex-col items-center justify-center bg-white dark:bg-black min-h-screen transition-colors duration-200'>
      <div className='flex items-center justify-center'>
        <Link href="/">
          <Image src={hb} alt='logo' width={300} height={300} />
        </Link>
      </div>

      <div className='w-[90%] mx-auto'>
        <Skeleton height="36px" width="200px" mb={4} className="dark:bg-gray-700" />
        <Skeleton height="24px" width="250px" mb={4} className="dark:bg-gray-700" />
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {[...Array(6)].map((_, index) => (
            <CartCardLoadingState key={index} />
          ))}
        </SimpleGrid>
      </div>

      <NavMenuLoadingState />
      <Tilt>
        <Box display="flex" justifyContent="center" mb={4}>
          <Link href="/">
            <Image src={hbaby} alt='logo' width={300} height={300} />
          </Link>
        </Box>
      </Tilt>
    </div>
  );
}; 