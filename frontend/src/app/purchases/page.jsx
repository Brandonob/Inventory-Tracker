'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  SimpleGrid,
  Badge,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  ButtonGroup,
  Button,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPurchases } from '../redux/slices/purchaseSlice';
import Image from 'next/image';
import hb from '../components/media/hb.png';
import hbaby from '../components/media/hbaby.png';
import Link from 'next/link'; 

export default function Purchases() {
  const dispatch = useDispatch();
  const { purchases, loading, error } = useSelector((state) => state.purchases);
  const [timeFilter, setTimeFilter] = useState('all');
  const [filteredPurchases, setFilteredPurchases] = useState([]);

  useEffect(() => {
    dispatch(fetchAllPurchases());
  }, []);

  useEffect(() => {
    if (!purchases) return;
    
    const now = new Date();
    const filtered = purchases.filter(purchase => {
      const purchaseDate = new Date(purchase.createdAt);
      switch (timeFilter) {
        case '24h':
          return (now - purchaseDate) <= 24 * 60 * 60 * 1000;
        case 'week':
          return (now - purchaseDate) <= 7 * 24 * 60 * 60 * 1000;
        case 'month':
          return (now - purchaseDate) <= 30 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });
    setFilteredPurchases(filtered);
  }, [purchases, timeFilter]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateTotal = (products) => {
    return products.reduce((sum, item) => 
      sum + (parseFloat(item.productPrice) * item.quantity), 0
    ).toFixed(2);
  };

  if (loading) {
    return (
      <Box p={5} display="flex" justifyContent="center">
        <Text color={'white'}>Loading purchase history...</Text>
      </Box>
    );
  }

  return(
  <Box 
  p={5}
  backgroundColor={'black'}
  minHeight={'100vh'}
  >
    <Box display="flex" justifyContent="center" mb={4}>
      <Link href="/">
        <Image src={hb} alt='logo' width={300} height={300} />
      </Link>
    </Box>
    <Heading color={'white'} mb={6}>Purchase History</Heading>
    
    <ButtonGroup spacing={4} mb={6}>
      <Button
        colorScheme={timeFilter === '24h' ? 'blue' : 'gray'}
        onClick={() => setTimeFilter('24h')}
      >
        Last 24 Hours
      </Button>
      <Button
        colorScheme={timeFilter === 'week' ? 'blue' : 'gray'}
        onClick={() => setTimeFilter('week')}
      >
        Past Week
      </Button>
      <Button
        colorScheme={timeFilter === 'month' ? 'blue' : 'gray'}
        onClick={() => setTimeFilter('month')}
      >
        Past Month
      </Button>
      <Button
        colorScheme={timeFilter === 'all' ? 'blue' : 'gray'}
        onClick={() => setTimeFilter('all')}
      >
        All Time
      </Button>
    </ButtonGroup>

    {filteredPurchases.length === 0 ? (
      <Text color={'white'}>No purchase history available</Text>
    ) : (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {filteredPurchases.map((purchase) => (
          <Card key={purchase._id} boxShadow="md">
            <CardHeader display="flex" justifyContent="space-between">
              <div className=''>
                <Heading size="md">
                  Order: {purchase.customerName}
                  {/* #{purchase._id.slice(-6)} */}
                </Heading>
                <Text color="gray.500" fontSize="sm">
                  {formatDate(purchase.createdAt)}
                </Text>
              </div>
              <div className='flex justify-center items-center h-[40px] w-[70px]'>
                {purchase.status === 'pending' && (
                  <Badge colorScheme='red'>Pending</Badge>
                )}
                {purchase.status === 'partial' && (
                  <Badge colorScheme='yellow'>Partial</Badge>
                ) }
                {purchase.status === 'paid' && (
                  <Badge colorScheme='green'>Paid</Badge>
                )}

              </div>
            </CardHeader>
            <CardBody>
              <Accordion allowMultiple>
                <AccordionItem border="none">
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Text fontWeight="bold">
                        {purchase.products.length} items
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                      <VStack align="stretch" spacing={3}>
                        {purchase.products.map((item, index) => (
                          <HStack key={index} justify="space-between">
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm">{`${item.product.name} - ${item.product.description}`}</Text>
                              <Text fontSize="xs" color="gray.500">
                                Qty: {item.quantity}
                              </Text>
                            </VStack>
                            <Text fontSize="sm">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </CardBody>
              <Divider />
              <CardFooter>
                <HStack justify="space-between" width="100%">
                  <Text>Total:</Text>
                  <Text fontWeight="bold">
                    ${purchase.total}
                  </Text>
                </HStack>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}
        <Box display="flex" justifyContent="center" mb={4}>
          <Link href="/">
            <Image src={hbaby} alt='logo' width={300} height={300} />
          </Link>
      </Box>
    </Box>
  );
}
