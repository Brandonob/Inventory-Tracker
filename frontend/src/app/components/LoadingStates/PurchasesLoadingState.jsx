import React from 'react';
import { 
  Box, 
  SimpleGrid, 
  Card, 
  CardHeader,
  CardBody,
  CardFooter,
  Skeleton,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import Image from 'next/image';
import hb from '../media/hb.png';
import hbaby from '../media/hbaby.png';
import Link from 'next/link';
import { NavMenuLoadingState } from './NavMenuLoadingState';
import Tilt from 'react-parallax-tilt';

const PurchaseCardLoadingState = () => (
  <Card 
    boxShadow='md' 
    borderRadius='lg' 
    overflow='hidden'
    className='bg-white dark:bg-gray-800 transition-colors duration-200'
  >
    <CardHeader>
      <Stack spacing={4}>
        <Skeleton height="24px" width="70%" className="dark:bg-gray-700" />
        <Skeleton height="20px" width="40%" className="dark:bg-gray-700" />
        <Stack direction="row" spacing={2}>
          <Skeleton height="20px" width="60px" className="dark:bg-gray-700" />
          <Skeleton height="20px" width="60px" className="dark:bg-gray-700" />
        </Stack>
      </Stack>
    </CardHeader>
    <CardBody>
      <Accordion allowMultiple>
        <AccordionItem border="none">
          <AccordionButton>
            <Skeleton height="20px" width="100px" className="dark:bg-gray-700" />
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Stack spacing={3}>
              {[...Array(3)].map((_, i) => (
                <Stack key={i} direction="row" justify="space-between">
                  <Stack>
                    <Skeleton height="16px" width="200px" className="dark:bg-gray-700" />
                    <Skeleton height="14px" width="100px" className="dark:bg-gray-700" />
                  </Stack>
                  <Skeleton height="16px" width="60px" className="dark:bg-gray-700" />
                </Stack>
              ))}
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </CardBody>
    <CardFooter>
      <Stack direction="row" justify="space-between" width="100%">
        <Skeleton height="20px" width="100px" className="dark:bg-gray-700" />
        <Skeleton height="40px" width="120px" className="dark:bg-gray-700" />
      </Stack>
    </CardFooter>
  </Card>
);

export const PurchasesLoadingState = () => {
  return (
    <div className='flex flex-col items-center justify-center bg-white dark:bg-black min-h-screen transition-colors duration-200'>
      <div className='flex items-center justify-center'>
        <Link href="/">
          <Image src={hb} alt='logo' width={300} height={300} />
        </Link>
      </div>

      <div className='w-[90%] mx-auto'>
        <Skeleton height="36px" width="250px" mb={4} className="dark:bg-gray-700" />
        <Stack direction="row" spacing={4} mb={6}>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height="40px" width="120px" className="dark:bg-gray-700" />
          ))}
        </Stack>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {[...Array(6)].map((_, index) => (
            <PurchaseCardLoadingState key={index} />
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